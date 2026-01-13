/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { ClipLoader } from 'react-spinners';
import { z } from 'zod';

import type {
  CountryCode,
  Locale,
} from '@/components/Modal/DepartmentModal/DepartmentModal';
import procedureModalStyle from '@/components/Modal/ProcedureModal/procedureModal.module.scss';
import type {
  NameJSONType,
  ReimbursementJSONType,
} from '@/hooks/useDepartment';
import { useGetAllDepartment } from '@/hooks/useDepartment';
import { useCreateProcedure, useEditProcedure } from '@/hooks/useProcedure';
import useScrollToError from '@/hooks/useScrollToError';
import type {
  ProcedureSchemaType,
  ReimbusementSchemaType,
} from '@/utils/global';
import {
  countryData,
  procedureObj,
  ProcedureSchema,
  reimburismentObj,
  ReimbursementSchema,
} from '@/utils/global';

interface CreateProcedureFormPropType {
  isEdit: boolean;
  updateId: string;
  onClose: () => void;
  selectedData: null | {
    id: string;
    name: NameJSONType;
    reimbursement: ReimbursementJSONType;
    category: {
      id: string;
      name: NameJSONType;
    };
  };
}

export type ProcedureFormSchemaType = `procedure${Capitalize<Locale>}` &
  `reimbursement${Capitalize<CountryCode>}` &
  `department`;

export const departmentTypeSchema = z.object({
  label: z.string().min(1, { message: 'Please select department to proceed' }),
  value: z.string().min(1, { message: 'Please select department to proceed' }),
});
export const procedureTypeSchema = z.object({
  label: z.string().min(1, { message: 'Please select procedure to proceed' }),
  value: z.string().min(1, { message: 'Please select procedure to proceed' }),
});

const procedureFormSchema = z.object({
  ...ProcedureSchema,
  ...ReimbursementSchema,
  department: departmentTypeSchema,
});
export type ProcedureFormFields = z.infer<typeof procedureFormSchema>;
export type DepartmentType = {
  value: string;
  label: string;
};
type FormErrors = {
  [key in ProcedureSchemaType]?: { message?: string };
} & {
  [key in ReimbusementSchemaType]?: { message?: string };
};
function CreateProcedureForm({
  isEdit,
  updateId,
  onClose,
  selectedData,
}: CreateProcedureFormPropType) {
  const [selectedOption, setSelectedOption] = React.useState<{
    label: string;
    value: string;
  } | null>(null);
  const editProcedure = useEditProcedure({ onClose });
  const allDepartment = useGetAllDepartment();
  const [createAnotherProcedure, setCreateAnotherProcedure] = useState(false);
  const [departmentList, setDepartmentList] = useState<Array<DepartmentType>>(
    [],
  );
  const createProcedure = useCreateProcedure({
    closeModal: !createAnotherProcedure ? onClose : null,
  });
  React.useEffect(() => {
    if (
      allDepartment.isSuccess &&
      allDepartment.data &&
      Array.isArray(allDepartment.data.data) &&
      allDepartment.data.data.length > 0
    ) {
      setDepartmentList(() =>
        allDepartment.data.data.map((department) => {
          if (department.parentCategoryId) {
            const parentCategory = allDepartment.data.data.find(
              (dept) => dept.id === department.parentCategoryId,
            );
            return {
              value: department.id,
              label: `${parentCategory?.name.en} -- ${department.name.en}`,
            };
          }
          return {
            value: department.id,
            label: department.name.en ?? '',
          };
        }),
      );
    }
  }, [allDepartment.data, allDepartment.isSuccess]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProcedureFormFields>({
    resolver: zodResolver(procedureFormSchema),
  });

  const handleCreateProcedure = (data: ProcedureFormFields) => {
    const procedureData = Object.keys(data).reduce(
      (acc, currValue) => {
        const localeName = currValue.split('procedure')[1]?.toLowerCase();
        if (localeName) {
          // @ts-ignore
          acc[localeName] = data[currValue] as string;
        }
        return acc;
      },
      {} as Record<string, string>,
    );
    const reimbursementData = Object.keys(data).reduce(
      (acc, currValue) => {
        const localeName = currValue.split('reimbursement')[1]?.toLowerCase();
        if (localeName) {
          // @ts-ignore
          acc[localeName] = Number(data[currValue]);
        }
        return acc;
      },
      {} as Record<string, number>,
    );
    createProcedure.mutate({
      name: {
        ...procedureData,
      },
      categoryId: data.department.value,
      reimbursement: {
        ...reimbursementData,
      },
    });
    reset();
  };
  const handleEditProcedure = (data: ProcedureFormFields) => {
    const procedureData = Object.keys(data).reduce(
      (acc, currValue) => {
        const localeName = currValue.split('procedure')[1]?.toLowerCase();
        if (localeName) {
          // @ts-ignore
          acc[localeName] = data[currValue] as string;
        }
        return acc;
      },
      {} as Record<string, string>,
    );
    const reimbursementData = Object.keys(data).reduce(
      (acc, currValue) => {
        const localeName = currValue.split('reimbursement')[1]?.toLowerCase();
        if (localeName) {
          // @ts-ignore
          acc[localeName] = Number(data[currValue]);
        }
        return acc;
      },
      {} as Record<string, number>,
    );
    editProcedure.mutate({
      procedureId: updateId,
      name: {
        ...procedureData,
      },
      reimbursement: {
        ...reimbursementData,
      },
    });
    setCreateAnotherProcedure(false);
    reset();
  };

  React.useEffect(() => {
    if (selectedData && selectedData.id && selectedData?.category && isEdit) {
      setSelectedOption({
        value: selectedData.category.name.en ?? '',
        label: selectedData.category.id,
      });
      setValue('department.label', selectedData.category.name.en ?? '');
      setValue('department.value', selectedData.category.id);
      Object.values(procedureObj).forEach((d) => {
        const locale = d.split('procedure')[1]?.toLowerCase();
        if (locale) {
          const val = selectedData.name[locale];
          if (val) {
            // @ts-ignore
            setValue(d as keyof ProcedureFormFields, val);
          }
        }
      });

      Object.values(reimburismentObj).forEach((d) => {
        const countryCode = d.split('reimbursement')[1]?.toLowerCase();
        if (
          countryCode &&
          selectedData?.reimbursement &&
          selectedData.reimbursement[countryCode]
        ) {
          const val = selectedData.reimbursement[countryCode]?.toString();
          if (val) {
            // @ts-ignore
            setValue(d as keyof ProcedureFormFields, val);
          }
        }
      });
    }
  }, [setValue, selectedData, isEdit]);

  const onFormSubmit: SubmitHandler<ProcedureFormFields> = (
    data: ProcedureFormFields,
  ) => {
    if (isEdit) {
      handleEditProcedure(data);
    } else {
      handleCreateProcedure(data);
    }
  };

  const shouldRenderProcedureError = countryData.some((c) => {
    const lang = procedureObj[c.language] as ProcedureFormSchemaType;
    return (
      (errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message
    );
  });
  useScrollToError(errors);
  return (
    <form
      className={procedureModalStyle.createProcedureFormContainer}
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <p className="mb-3 font-poppins text-base font-normal text-neutral-2">
        Department Name/ Sub-category
      </p>
      <Controller
        name="department"
        control={control}
        defaultValue={
          selectedOption?.label
            ? selectedOption
            : {
                label: '',
                value: '',
              }
        }
        render={({ field }) => (
          <Select
            {...field}
            options={departmentList}
            isDisabled={isEdit}
            onChange={(value) => {
              setSelectedOption(value);
              field.onChange(value);
            }}
          />
        )}
      />
      {errors.department && errors.department.label && (
        <div className="mt-1 text-start font-lexend text-base font-normal text-error">
          {errors.department.label.message}
        </div>
      )}
      <p
        style={{ marginTop: '24px', display: 'block' }}
        className="font-poppins text-base font-normal text-neutral-2"
      >
        Procedure name
      </p>
      <input
        className="w-full rounded-lg border-2 border-lightsilver px-4 py-3"
        style={{ marginBottom: '4px' }}
        type="text"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        placeholder="Enter procedure name"
        onChange={(e) => {
          const { value } = e.target;
          Object.values(procedureObj).forEach((d) => {
            // @ts-ignore
            setValue(d as keyof ProcedureFormFields, value);
          });
        }}
      />
      {/* <div className={procedureModalStyle.languageTabContainer}>
        {countryData.map((data) => {
          const lang = procedureObj[data.language] as ProcedureFormSchemaType;
          return (
            <button
              key={data.locale}
              onClick={() => setActiveLanguageTab(data.language)}
              style={
                data.language === activeLanguageTab
                  ? {
                      border: '2px solid rgba(9, 111, 144, 1)',
                      color: 'rgba(9, 111, 144, 1)',
                      backgroundColor: 'rgba(242, 250, 252, 1)',
                    }
                  : {}
              }
              className={`${
                activeLanguageTab === data.language
                  ? `px-3 py-2 ${procedureModalStyle.activeLanguageTab} ${(errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message ? '!border-2 !border-error !text-error' : ''}`
                  : ''
              }`}
              type="button"
            >
              {data.language}
            </button>
          );
        })}
      </div>
      {countryData.map((c) => {
        const lang = procedureObj[c.language] as ProcedureFormSchemaType;
        return (
          <div key={c.countryCode}>
            {c.language === activeLanguageTab && (
              <input
                className="w-full rounded-lg border-2 border-lightsilver px-4 py-3"
                style={{ marginBottom: '4px' }}
                type="text"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                placeholder="Enter procedure name"
                {...register(lang)}
              />
            )}
          </div>
        );
      })} */}
      {shouldRenderProcedureError && (
        <div className="mb-5 mt-1 text-start font-lexend text-base font-normal text-error">
          Fill in details in all the languages
        </div>
      )}
      <div
        className={`${procedureModalStyle.procedureReimbursementInputContainer} mb-4 mt-7`}
      >
        <p className="font-poppins text-base font-normal text-neutral-2">
          Reimbursements
        </p>
        {countryData.map((data) => {
          const lang = reimburismentObj[
            data.language
          ] as ProcedureFormSchemaType;
          return (
            <div key={data.locale} className="mb-3 mt-[10px]">
              <div className={procedureModalStyle.procedureReimbursementInput}>
                <div
                  className={procedureModalStyle.inputWrapper}
                  style={
                    (errors as FormErrors)[lang] &&
                    (errors as FormErrors)[lang]?.message
                      ? { border: '1.5px solid rgba(203, 0, 25, 1)' }
                      : { border: '1.5px solid rgba(217, 222, 231, 1)' }
                  }
                >
                  <div
                    className={`${procedureModalStyle.countryCodeWrapper} ${
                      (errors as FormErrors)[lang] &&
                      (errors as FormErrors)[lang]?.message
                        ? 'rounded-s-lg border-y-[1.48px] border-s-[0.5px] border-error'
                        : 'rounded-lg border border-primary-6'
                    }`}
                  >
                    <Image
                      src={data.flagIcon}
                      alt="reimbursement input flag"
                      height={20}
                      width={20}
                    />
                    <span className="!font-poppins !text-sm !font-normal !text-neutral-2">
                      {data.currency}
                    </span>
                  </div>
                  <input
                    type="text"
                    {...register(lang)}
                    id="reimbursement"
                    placeholder={`Reimbursement for ${data.name}`}
                    className={`${(errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message ? '!border-2 !border-error' : '!border-2 !border-lightsilver'} w-full rounded-lg px-4 py-3 placeholder:font-lexend placeholder:text-sm placeholder:font-light placeholder:text-neutral-4`}
                  />
                </div>
                {(errors as FormErrors)[lang] && (
                  <div className="text-start font-lexend text-base font-normal text-error">
                    {(errors as FormErrors)[lang]?.message}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* {!isEdit && (
        <div style={{ marginTop: '64px', marginBottom: '28px' }}>
          <label className={departmentModalStyle.checkboxLabel}>
            <span className="absolute top-[-2px]">
              Create another procedure
            </span>
            <input
              className={departmentModalStyle.checkboxStyle}
              type="checkbox"
              checked={createAnotherProcedure}
              id="another-procedure"
              onChange={() =>
                setCreateAnotherProcedure((prevState) => !prevState)
              }
            />
            <span className={departmentModalStyle.checkmark} />
          </label>
        </div>
      )} */}
      {isEdit ? (
        <button
          className={`${editProcedure.isPending ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} flex w-[280px] items-center justify-center rounded-lg px-4 py-[15px]`}
          style={{ marginTop: '64px' }}
          type="submit"
        >
          {editProcedure.isPending ? (
            <ClipLoader
              loading={editProcedure.isPending}
              color="#fff"
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <span className="font-poppins text-sm font-bold text-white">
              Save changes
            </span>
          )}
        </button>
      ) : (
        <button
          className={`${createProcedure.isPending ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} flex w-[280px] items-center justify-center rounded-lg px-4 py-[15px]`}
          type="submit"
        >
          {createProcedure.isPending ? (
            <ClipLoader
              loading={createProcedure.isPending}
              color="#fff"
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <span className="font-poppins text-sm font-bold text-white">
              Create procedure
            </span>
          )}
        </button>
      )}
    </form>
  );
}

export default CreateProcedureForm;
