/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { z } from 'zod';

import procedureModalStyle from '@/components/Modal/ProcedureModal/procedureModal.module.scss';
import type { LanguagesType } from '@/types/components';
import { countryData } from '@/utils/global';

const options = [
  { value: 'epilepsy', label: 'epilepsy' },
  { value: 'dementia', label: 'dementia' },
  { value: 'cardio', label: 'cardio' },
  { value: 'cardiac arrest', label: 'cardiac arrest' },
  { value: 'malaria', label: 'malaria' },
  { value: 'tuberclusios', label: 'tuberclusios' },
];

interface CreateProcedureFormPropType {
  isEdit: boolean;
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

function CreateProcedureForm({ isEdit }: CreateProcedureFormPropType) {
  const [activeLanguageTab, setActiveLanguageTab] =
    useState<LanguagesType>('English');

  const [createAnotherProcedure, setCreateAnotherProcedure] = useState(false);

  const handleCreateProcedure = () => {
    // API call to create sub category
    setCreateAnotherProcedure(false);
    setActiveLanguageTab('English');
  };
  const handleEditProcedure = () => {
    // API call to create sub category
    setCreateAnotherProcedure(false);
    setActiveLanguageTab('English');
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProcedureFormFields>({
    resolver: zodResolver(procedureFormSchema),
  });

  const onFormSubmit: SubmitHandler<ProcedureFormFields> = () => {
    if (isEdit) {
      handleEditProcedure();
    } else {
      handleCreateProcedure();
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
        render={({ field }) => <Select {...field} options={options} />}
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
            <div key={data.locale}>
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
            onClick={() => setCreateAnotherProcedure(!createAnotherProcedure)}
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
          className="flex items-center justify-center rounded-lg bg-darkteal px-6 py-3 font-poppins text-2xl font-normal text-white"
          style={{ marginTop: '64px' }}
          type="submit"
        >
          Save changes
        </button>
      ) : (
        <button
          className="flex items-center justify-center rounded-lg bg-darkteal px-6 py-3 font-poppins text-2xl font-normal text-white"
          type="submit"
        >
          Create procedure
        </button>
      )}
    </form>
  );
}

export default CreateProcedureForm;
