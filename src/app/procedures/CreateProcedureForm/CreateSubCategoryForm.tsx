/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { ClipLoader } from 'react-spinners';
import { z } from 'zod';

import procedureModalStyle from '@/components/Modal/ProcedureModal/procedureModal.module.scss';
import {
  useCreateDepartment,
  useGetAllDepartment,
} from '@/hooks/useDepartment';
import type { LanguagesType } from '@/types/components';
import { countryData } from '@/utils/global';

import type { DepartmentType } from './CreateProcedureForm';
import { departmentTypeSchema } from './CreateProcedureForm';

interface CreateSubCategoryFormPropType {
  isEdit: boolean;
}

export type SubCategoryFormSchemaType =
  | 'subCategoryEn'
  | 'subCategoryNb'
  | 'subCategoryDa'
  | 'subCategorySv'
  | 'department';

const subCategoryFormSchema = z.object({
  subCategoryEn: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  subCategoryNb: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  subCategoryDa: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  subCategorySv: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  department: departmentTypeSchema,
});
export type SubCategoryFormFields = z.infer<typeof subCategoryFormSchema>;

function CreateSubCategoryForm({ isEdit }: CreateSubCategoryFormPropType) {
  const createDepartment = useCreateDepartment();
  const allDepartment = useGetAllDepartment();
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
  const [createAnotherSubCategory, setCreateAnotherSubCategory] =
    useState(false);

  const [activeLanguageTab, setActiveLanguageTab] =
    useState<LanguagesType>('English');

  const handleCreateSubCategory = (data: SubCategoryFormFields) => {
    createDepartment.mutate({
      name: {
        en: data.subCategoryEn,
        nb: data.subCategoryNb,
        da: data.subCategoryDa,
        sv: data.subCategorySv,
      },
      parentCategoryId: data.department.value,
    });
    setCreateAnotherSubCategory(false);
    setActiveLanguageTab('English');
  };
  const handleEditSubCategory = () => {
    // API call to create sub category
    setCreateAnotherSubCategory(false);
    setActiveLanguageTab('English');
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubCategoryFormFields>({
    resolver: zodResolver(subCategoryFormSchema),
  });

  const onFormSubmit: SubmitHandler<SubCategoryFormFields> = (
    data: SubCategoryFormFields,
  ) => {
    if (isEdit) {
      handleEditSubCategory();
    } else {
      handleCreateSubCategory(data);
    }
  };

  const subCategoryObj = {
    English: 'subCategoryEn',
    Norwegian: 'subCategoryNb',
    Danish: 'subCategoryDa',
    Swedish: 'subCategorySv',
  };

  const shouldRenderProcedureError = countryData.some((c) => {
    const lang = subCategoryObj[c.language] as SubCategoryFormSchemaType;
    return errors[lang] && errors[lang]?.message;
  });

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className={procedureModalStyle.createSubcategoryFormContainer}
    >
      <label
        style={{ display: 'block', marginBottom: '8px' }}
        className={procedureModalStyle.departmentInputLabel}
      >
        Department name
      </label>

      <Controller
        name="department"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={departmentList}
            classNames={{
              control: (state) =>
                state.isFocused
                  ? '!border !border-lightsilver py-[10px] px-2 !rounded-xl'
                  : '',
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
        style={{ display: 'block', marginTop: '24px' }}
        className={procedureModalStyle.subCategoryInputLabel}
      >
        Sub-category
      </p>

      <div className={procedureModalStyle.languageTabContainer}>
        {countryData.map((data) => {
          const lang = subCategoryObj[
            data.language
          ] as SubCategoryFormSchemaType;
          return (
            <button
              key={data.locale}
              onClick={() => setActiveLanguageTab(data.language)}
              className={
                activeLanguageTab === data.language
                  ? `${procedureModalStyle.activeLanguageTab}  ${errors[lang] && errors[lang]?.message ? '!border !border-error !text-error' : ''}`
                  : ''
              }
              type="button"
            >
              {data.language}
            </button>
          );
        })}
      </div>

      {countryData.map((c) => {
        const lang = subCategoryObj[c.language] as SubCategoryFormSchemaType;
        return (
          <div key={c.countryCode}>
            {c.language === activeLanguageTab && (
              <input
                className={procedureModalStyle.procedureInput}
                type="text"
                placeholder="Enter sub-category"
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

      {!isEdit && (
        <div
          className={`${procedureModalStyle.procedureCheckboxContainer} mt-16`}
        >
          <input
            onChange={() =>
              setCreateAnotherSubCategory(!createAnotherSubCategory)
            }
            checked={createAnotherSubCategory}
            className={procedureModalStyle.checkbox}
            type="checkbox"
            id="sub-cat-radio"
          />
          <label
            className={procedureModalStyle.checkboxLabel}
            htmlFor="sub-cat-radio"
          >
            Create another sub category
          </label>
        </div>
      )}

      {isEdit ? (
        <button
          className="mt-5 flex items-center justify-center rounded-lg bg-darkteal px-6 py-3 font-poppins text-2xl font-normal text-white"
          type="submit"
        >
          Save changes
        </button>
      ) : (
        <button
          className="mb-5 flex items-center justify-center rounded-lg bg-darkteal px-6 py-3 font-poppins text-2xl font-normal text-white"
          type="submit"
        >
          {createDepartment.isPending ? (
            <ClipLoader
              loading={createDepartment.isPending}
              color="#fff"
              size={30}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <span>Create sub category</span>
          )}
        </button>
      )}
    </form>
  );
}

export default CreateSubCategoryForm;
