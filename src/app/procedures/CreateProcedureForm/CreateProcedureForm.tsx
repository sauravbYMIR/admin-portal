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

import departmentModalStyle from '@/components/Modal/DepartmentModal/departmentModal.module.scss';
import procedureModalStyle from '@/components/Modal/ProcedureModal/procedureModal.module.scss';
import { useGetAllDepartment } from '@/hooks/useDepartment';
import {
  useCreateProcedure,
  useEditProcedure,
  useGetProcedureById,
} from '@/hooks/useProcedure';
import type { LanguagesType } from '@/types/components';
import { countryData } from '@/utils/global';

interface CreateProcedureFormPropType {
  isEdit: boolean;
  updateId: string;
  onClose: () => void;
}

export type ProcedureFormSchemaType =
  | 'procedureEn'
  | 'procedureNb'
  | 'procedureDa'
  | 'procedureSv'
  | 'reimbursementIe'
  | 'reimbursementNo'
  | 'reimbursementDk'
  | 'reimbursementSe'
  | 'department';

export const departmentTypeSchema = z.object({
  label: z.string().min(1, { message: 'Please select department to proceed' }),
  value: z.string().min(1, { message: 'Please select department to proceed' }),
});
export const procedureTypeSchema = z.object({
  label: z.string().min(1, { message: 'Please select procedure to proceed' }),
  value: z.string().min(1, { message: 'Please select procedure to proceed' }),
});

const procedureFormSchema = z.object({
  procedureEn: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  procedureNb: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  procedureDa: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  procedureSv: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  reimbursementIe: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: 'Fill in all required details in correct format',
    }),
  reimbursementNo: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: 'Fill in all required details in correct format',
    }),
  reimbursementDk: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: 'Fill in all required details in correct format',
    }),
  reimbursementSe: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: 'Fill in all required details in correct format',
    }),
  department: departmentTypeSchema,
});
export type ProcedureFormFields = z.infer<typeof procedureFormSchema>;
export type DepartmentType = {
  value: string;
  label: string;
};

function CreateProcedureForm({
  isEdit,
  updateId,
  onClose,
}: CreateProcedureFormPropType) {
  const [selectedOption, setSelectedOption] = React.useState<{
    label: string;
    value: string;
  } | null>(null);
  const reqProcedure = useGetProcedureById({ id: updateId });
  const editProcedure = useEditProcedure({ onClose });
  const allDepartment = useGetAllDepartment();
  const [activeLanguageTab, setActiveLanguageTab] =
    useState<LanguagesType>('English');
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
              label:
                `${parentCategory?.name.en} -- ${department.name.en}` ||
                `${parentCategory?.name.nb} -- ${department.name.nb}` ||
                `${parentCategory?.name.sv} -- ${department.name.sv}` ||
                `${parentCategory?.name.da} -- ${department.name.da}`,
            };
          }
          return {
            value: department.id,
            label:
              department.name.en ||
              department.name.nb ||
              department.name.sv ||
              department.name.da,
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
    createProcedure.mutate({
      name: {
        en: data.procedureEn,
        nb: data.procedureNb,
        da: data.procedureDa,
        sv: data.procedureSv,
      },
      categoryId: data.department.value,
      reimbursement: {
        ie: Number(data.reimbursementIe),
        no: Number(data.reimbursementNo),
        dk: Number(data.reimbursementDk),
        se: Number(data.reimbursementSe),
      },
    });
    setActiveLanguageTab('English');
    reset();
  };
  const handleEditProcedure = (data: ProcedureFormFields) => {
    editProcedure.mutate({
      procedureId: updateId,
      name: {
        en: data.procedureEn,
        nb: data.procedureNb,
        da: data.procedureDa,
        sv: data.procedureSv,
      },
      reimbursement: {
        ie: Number(data.reimbursementIe),
        no: Number(data.reimbursementNo),
        dk: Number(data.reimbursementDk),
        se: Number(data.reimbursementSe),
      },
    });
    setCreateAnotherProcedure(false);
    setActiveLanguageTab('English');
    reset();
  };

  React.useEffect(() => {
    if (
      updateId &&
      reqProcedure.isSuccess &&
      reqProcedure.data &&
      reqProcedure.data.success &&
      reqProcedure.data.data.id
    ) {
      setSelectedOption({
        value:
          reqProcedure.data.data.category.name.en ||
          reqProcedure.data.data.category.name.da ||
          reqProcedure.data.data.category.name.sv ||
          reqProcedure.data.data.category.name.nb,
        label: reqProcedure.data.data.category.id,
      });
      setValue(
        'department.label',
        reqProcedure.data.data.category.name.en ||
          reqProcedure.data.data.category.name.nb ||
          reqProcedure.data.data.category.name.da ||
          reqProcedure.data.data.category.name.sv,
      );
      setValue('department.value', reqProcedure.data.data.category.id);
      setValue('procedureEn', reqProcedure.data.data.name.en);
      setValue('procedureDa', reqProcedure.data.data.name.da);
      setValue('procedureSv', reqProcedure.data.data.name.sv);
      setValue('procedureNb', reqProcedure.data.data.name.nb);
      if (reqProcedure.data.data.reimbursement?.ie) {
        setValue(
          'reimbursementIe',
          reqProcedure.data.data.reimbursement.ie.toString(),
        );
      }
      if (reqProcedure.data.data.reimbursement?.no) {
        setValue(
          'reimbursementNo',
          reqProcedure.data.data.reimbursement.no.toString(),
        );
      }
      if (reqProcedure.data.data.reimbursement?.se) {
        setValue(
          'reimbursementSe',
          reqProcedure.data.data.reimbursement.se.toString(),
        );
      }
      if (reqProcedure.data.data.reimbursement?.dk) {
        setValue(
          'reimbursementDk',
          reqProcedure.data.data.reimbursement.dk.toString(),
        );
      }
    }
  }, [reqProcedure.data, reqProcedure.isSuccess, setValue, updateId]);

  const onFormSubmit: SubmitHandler<ProcedureFormFields> = (
    data: ProcedureFormFields,
  ) => {
    if (isEdit) {
      handleEditProcedure(data);
    } else {
      handleCreateProcedure(data);
    }
  };

  const procedureObj = {
    English: 'procedureEn',
    Norwegian: 'procedureNb',
    Danish: 'procedureDa',
    Swedish: 'procedureSv',
  };
  const reimburismentObj = {
    English: 'reimbursementIe',
    Norwegian: 'reimbursementNo',
    Danish: 'reimbursementDk',
    Swedish: 'reimbursementSe',
  };

  const shouldRenderProcedureError = countryData.some((c) => {
    const lang = procedureObj[c.language] as ProcedureFormSchemaType;
    return errors[lang] && errors[lang]?.message;
  });

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
      <div className={procedureModalStyle.languageTabContainer}>
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
                  ? `px-3 py-2 ${procedureModalStyle.activeLanguageTab} ${errors[lang] && errors[lang]?.message ? '!border-2 !border-error !text-error' : ''}`
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
      })}
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
                    errors[lang] && errors[lang]?.message
                      ? { border: '1.5px solid rgba(203, 0, 25, 1)' }
                      : { border: '1.5px solid rgba(217, 222, 231, 1)' }
                  }
                >
                  <div
                    className={`${procedureModalStyle.countryCodeWrapper} ${
                      errors[lang] && errors[lang]?.message
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
                    className={`${errors[lang] && errors[lang]?.message ? '!border-2 !border-error' : '!border-2 !border-lightsilver'} w-full rounded-lg px-4 py-3 placeholder:font-lexend placeholder:text-sm placeholder:font-light placeholder:text-neutral-4`}
                  />
                </div>
                {errors[lang] && (
                  <div className="text-start font-lexend text-base font-normal text-error">
                    {errors[lang]?.message}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!isEdit && (
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
      )}
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
