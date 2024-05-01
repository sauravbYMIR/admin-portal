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
}

export type ProcedureFormSchemaType =
  | 'procedureEn'
  | 'procedureNb'
  | 'procedureDa'
  | 'procedureSv'
  | 'reimbursementEn'
  | 'reimbursementNb'
  | 'reimbursementDa'
  | 'reimbursementSv'
  | 'department';

export const departmentTypeSchema = z.object({
  label: z.string(),
  value: z.string(),
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
  reimbursementEn: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: 'Fill in all required details in correct format',
    }),
  reimbursementNb: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: 'Fill in all required details in correct format',
    }),
  reimbursementDa: z
    .string()
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: 'Fill in all required details in correct format',
    }),
  reimbursementSv: z
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
}: CreateProcedureFormPropType) {
  const [selectedOption, setSelectedOption] = React.useState<{
    label: string;
    value: string;
  } | null>(null);
  const reqProcedure = useGetProcedureById({ id: updateId });
  const editProcedure = useEditProcedure();
  const createProcedure = useCreateProcedure();
  const allDepartment = useGetAllDepartment();
  const [activeLanguageTab, setActiveLanguageTab] =
    useState<LanguagesType>('English');
  const [createAnotherProcedure, setCreateAnotherProcedure] = useState(false);
  const [departmentList, setDepartmentList] = useState<Array<DepartmentType>>(
    [],
  );
  React.useEffect(() => {
    if (
      allDepartment.isSuccess &&
      allDepartment.data &&
      Array.isArray(allDepartment.data.data) &&
      allDepartment.data.data.length > 0
    ) {
      setDepartmentList(() =>
        allDepartment.data.data.map((department) => ({
          value: department.id,
          label:
            department.name.en ||
            department.name.nb ||
            department.name.sv ||
            department.name.da,
        })),
      );
    }
  }, [allDepartment.data, allDepartment.isSuccess]);
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
        en: Number(data.reimbursementEn),
        nb: Number(data.reimbursementNb),
        da: Number(data.reimbursementDa),
        sv: Number(data.reimbursementSv),
      },
    });
    setCreateAnotherProcedure(false);
    setActiveLanguageTab('English');
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
        en: Number(data.reimbursementEn),
        nb: Number(data.reimbursementNb),
        da: Number(data.reimbursementDa),
        sv: Number(data.reimbursementSv),
      },
    });
    setCreateAnotherProcedure(false);
    setActiveLanguageTab('English');
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProcedureFormFields>({
    resolver: zodResolver(procedureFormSchema),
  });

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
      setValue(
        'reimbursementEn',
        reqProcedure.data.data.reimbursement.en.toString(),
      );
      setValue(
        'reimbursementNb',
        reqProcedure.data.data.reimbursement.nb.toString(),
      );
      setValue(
        'reimbursementSv',
        reqProcedure.data.data.reimbursement.sv.toString(),
      );
      setValue(
        'reimbursementDa',
        reqProcedure.data.data.reimbursement.da.toString(),
      );
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
    English: 'reimbursementEn',
    Norwegian: 'reimbursementNb',
    Danish: 'reimbursementDa',
    Swedish: 'reimbursementSv',
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
      <p
        style={{ marginBottom: '8px', display: 'block' }}
        className={procedureModalStyle.departmentInputLabel}
      >
        Department name/ Sub-category
      </p>
      <Controller
        name="department"
        control={control}
        defaultValue={
          selectedOption?.label ? selectedOption : { label: '', value: '' }
        }
        render={({ field }) => (
          <Select
            {...field}
            options={departmentList}
            onChange={(value) => {
              setSelectedOption(value);
              field.onChange(value);
            }}
          />
        )}
      />
      {errors.department && (
        <div className="mt-1 text-start font-lexend text-base font-normal text-error">
          {errors.department.message}
        </div>
      )}
      <p
        style={{ marginTop: '24px', display: 'block' }}
        className={procedureModalStyle.subCategoryInputLabel}
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
              className={`${
                activeLanguageTab === data.language
                  ? `${procedureModalStyle.activeLanguageTab} ${errors[lang] && errors[lang]?.message ? '!border !border-error !text-error' : ''}`
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
                className={procedureModalStyle.procedureInput}
                style={{ marginBottom: '4px' }}
                type="text"
                placeholder="Enter procedure"
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
        className={`${procedureModalStyle.procedureReimbursementInputContainer} mb-4`}
      >
        {countryData.map((data) => {
          const lang = reimburismentObj[
            data.language
          ] as ProcedureFormSchemaType;

          return (
            <div key={data.locale} className="mb-5 mt-6">
              <div className={procedureModalStyle.procedureReimbursementInput}>
                <label
                  htmlFor="reimbursement"
                  className={
                    errors[lang] && errors[lang]?.message ? '!text-error' : ''
                  }
                >
                  Reimbursement for {data.name}
                </label>
                <div className={procedureModalStyle.inputWrapper}>
                  <div
                    className={`${procedureModalStyle.countryCodeWrapper} ${
                      errors[lang] && errors[lang]?.message
                        ? 'rounded-s-lg border-y-2 border-s-2 border-error'
                        : 'rounded-lg border border-primary-6'
                    }`}
                  >
                    <Image src={data.flagIcon} alt="reimbursement input flag" />
                    <span>{data.currency}</span>
                  </div>
                  <input
                    type="text"
                    {...register(lang)}
                    id="reimbursement"
                    className={
                      errors[lang] && errors[lang]?.message
                        ? '!border-2 !border-error'
                        : ''
                    }
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
        <div
          className={procedureModalStyle.procedureCheckboxContainer}
          style={{ marginTop: '64px' }}
        >
          <input
            onChange={() => setCreateAnotherProcedure(!createAnotherProcedure)}
            checked={createAnotherProcedure}
            className={procedureModalStyle.checkbox}
            id="another-procedure"
            type="checkbox"
          />
          <label
            className={procedureModalStyle.checkboxLabel}
            htmlFor="another-procedure"
          >
            Create another procedure
          </label>
        </div>
      )}
      {isEdit ? (
        <button
          className="flex w-[357px] items-center justify-center rounded-lg bg-darkteal px-6 py-3 font-poppins text-2xl font-normal text-white"
          style={{ marginTop: '64px' }}
          type="submit"
        >
          {editProcedure.isPending ? (
            <ClipLoader
              loading={editProcedure.isPending}
              color="#fff"
              size={30}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <span>Save changes</span>
          )}
        </button>
      ) : (
        <button
          className="flex w-[357px] items-center justify-center rounded-lg bg-darkteal px-6 py-3 font-poppins text-2xl font-normal text-white"
          type="submit"
        >
          {createProcedure.isPending ? (
            <ClipLoader
              loading={createProcedure.isPending}
              color="#fff"
              size={30}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <span>Create procedure</span>
          )}
        </button>
      )}
    </form>
  );
}

export default CreateProcedureForm;
