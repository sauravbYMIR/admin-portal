/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { ClipLoader } from 'react-spinners';
import { z } from 'zod';

import departmentModalStyle from '@/components/Modal/DepartmentModal/departmentModal.module.scss';
import procedureModalStyle from '@/components/Modal/ProcedureModal/procedureModal.module.scss';
import {
  useCreateDepartment,
  useEditDepartment,
  useGetAllDepartment,
  useGetDepartmentById,
} from '@/hooks/useDepartment';
import type { LanguagesType } from '@/types/components';
import { countryData } from '@/utils/global';

import type { DepartmentType } from './CreateProcedureForm';
import { departmentTypeSchema } from './CreateProcedureForm';

interface CreateSubCategoryFormPropType {
  isEdit: boolean;
  updateId: string;
  onClose: () => void;
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

function CreateSubCategoryForm({
  isEdit,
  updateId,
  onClose,
}: CreateSubCategoryFormPropType) {
  const [selectedOption, setSelectedOption] = React.useState<{
    label: string;
    value: string;
  } | null>(null);
  const reqdDept = useGetDepartmentById({ id: updateId });
  const editDepartment = useEditDepartment({ isSubCat: true, onClose });

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
        allDepartment.data.data
          .filter((department) => !department.parentCategoryId)
          .map((department) => ({
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

  const createDepartment = useCreateDepartment({
    isCreateSubCategory: true,
    closeModal: !createAnotherSubCategory ? onClose : null,
  });

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
    setActiveLanguageTab('English');
  };
  const handleEditSubCategory = (data: SubCategoryFormFields) => {
    editDepartment.mutate({
      departmentId: updateId,
      name: {
        en: data.subCategoryEn,
        nb: data.subCategoryNb,
        da: data.subCategoryDa,
        sv: data.subCategorySv,
      },
    });
    setCreateAnotherSubCategory(false);
    setActiveLanguageTab('English');
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SubCategoryFormFields>({
    resolver: zodResolver(subCategoryFormSchema),
  });

  React.useEffect(() => {
    if (
      updateId &&
      reqdDept.isSuccess &&
      reqdDept.data &&
      reqdDept.data.success &&
      reqdDept.data.data.id
    ) {
      setValue(
        'department.label',
        reqdDept.data.data.parentCategory.name.en ||
          reqdDept.data.data.parentCategory.name.da ||
          reqdDept.data.data.parentCategory.name.nb ||
          reqdDept.data.data.parentCategory.name.sv,
      );
      setSelectedOption(() => ({
        label:
          reqdDept.data.data.parentCategory.name.en ||
          reqdDept.data.data.parentCategory.name.da ||
          reqdDept.data.data.parentCategory.name.nb ||
          reqdDept.data.data.parentCategory.name.sv,
        value: reqdDept.data.data.parentCategory.id,
      }));
      setValue('department.value', reqdDept.data.data.parentCategory.id);
      setValue('subCategoryEn', reqdDept.data.data.name.en);
      setValue('subCategoryDa', reqdDept.data.data.name.da);
      setValue('subCategorySv', reqdDept.data.data.name.sv);
      setValue('subCategoryNb', reqdDept.data.data.name.nb);
    }
  }, [reqdDept.data, reqdDept.isSuccess, setValue, updateId]);

  const onFormSubmit: SubmitHandler<SubCategoryFormFields> = (
    data: SubCategoryFormFields,
  ) => {
    if (isEdit) {
      handleEditSubCategory(data);
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

  React.useEffect(() => {
    if (createDepartment.isSuccess || editDepartment.isSuccess) {
      reset();
    }
  }, [
    createDepartment.isSuccess,
    editDepartment.isSuccess,
    createAnotherSubCategory,
    reset,
  ]);

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className={procedureModalStyle.createSubcategoryFormContainer}
    >
      <label
        style={{ display: 'block', marginBottom: '8px' }}
        className="font-poppins text-base font-normal text-neutral-2"
      >
        Department Name
      </label>

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
            isDisabled={isEdit}
            classNames={{
              control: (state) =>
                state.isFocused
                  ? '!border !border-lightsilver py-[10px] px-2 !rounded-xl'
                  : '',
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
        style={{ display: 'block', marginTop: '24px' }}
        className="font-poppins text-base font-normal text-neutral-2"
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
              style={
                data.language === activeLanguageTab
                  ? {
                      border: '2px solid rgba(9, 111, 144, 1)',
                      color: 'rgba(9, 111, 144, 1)',
                      backgroundColor: 'rgba(242, 250, 252, 1)',
                    }
                  : {}
              }
              className={
                activeLanguageTab === data.language
                  ? `px-3 py-2 ${procedureModalStyle.activeLanguageTab}  ${errors[lang] && errors[lang]?.message ? '!border-2 !border-error !text-error' : ''}`
                  : ''
              }
              type="button"
            >
              <span className="font-poppins text-sm font-medium text-darkteal">
                {data.language}
              </span>
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
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                className="w-full rounded-lg border-2 border-lightsilver px-4 py-3"
                type="text"
                placeholder="Enter sub-category name"
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
        <div className="mb-7 mt-16">
          <label className={departmentModalStyle.checkboxLabel}>
            <span className="absolute top-[-2px]">
              Create another sub category
            </span>
            <input
              className={departmentModalStyle.checkboxStyle}
              type="checkbox"
              checked={createAnotherSubCategory}
              id="sub-cat-radio"
              onChange={() =>
                setCreateAnotherSubCategory((prevState) => !prevState)
              }
            />
            <span className={departmentModalStyle.checkmark} />
          </label>
        </div>
      )}

      {isEdit ? (
        <button
          className={`${editDepartment.isPending ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} mt-6 flex w-[280px] items-center justify-center rounded-lg px-4 py-[15px]`}
          type="submit"
        >
          {editDepartment.isPending ? (
            <ClipLoader
              loading={editDepartment.isPending}
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
          className={`${createDepartment.isPending ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} flex w-[280px] items-center justify-center rounded-lg px-4 py-[15px]`}
          type="submit"
        >
          {createDepartment.isPending ? (
            <ClipLoader
              loading={createDepartment.isPending}
              color="#fff"
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <span className="font-poppins text-sm font-bold text-white">
              Create sub category
            </span>
          )}
        </button>
      )}
    </form>
  );
}

export default CreateSubCategoryForm;
