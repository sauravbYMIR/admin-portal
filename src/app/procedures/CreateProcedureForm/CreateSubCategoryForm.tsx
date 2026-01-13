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
import type { NameJSONType } from '@/hooks/useDepartment';
import {
  useCreateDepartment,
  useEditDepartment,
  useGetAllDepartment,
} from '@/hooks/useDepartment';
import useScrollToError from '@/hooks/useScrollToError';
import type { SubCategoryFormSchemaType } from '@/utils/global';
import { countryData, subCategoryObj, SubCategorySchema } from '@/utils/global';

import type { DepartmentType } from './CreateProcedureForm';
import { departmentTypeSchema } from './CreateProcedureForm';

interface CreateSubCategoryFormPropType {
  isEdit: boolean;
  updateId: string;
  onClose: () => void;
  selectedData: null | {
    id: string;
    name: NameJSONType;
    category: { id: string; name: NameJSONType };
  };
}

export type SubCategoryFormWithDepSchemaType = SubCategoryFormSchemaType &
  `department`;

const subCategoryFormSchema = z.object({
  ...SubCategorySchema,
  department: departmentTypeSchema,
});
export type SubCategoryFormFields = z.infer<typeof subCategoryFormSchema>;
type FormErrors = {
  [key in SubCategoryFormWithDepSchemaType]?: { message?: string };
};

function CreateSubCategoryForm({
  isEdit,
  updateId,
  onClose,
  selectedData,
}: CreateSubCategoryFormPropType) {
  const [selectedOption, setSelectedOption] = React.useState<{
    label: string;
    value: string;
  } | null>(null);
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
            label: department.name.en ?? '',
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

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SubCategoryFormFields>({
    resolver: zodResolver(subCategoryFormSchema),
  });

  const handleCreateSubCategory = (data: SubCategoryFormFields) => {
    const subCategoryData = Object.keys(data).reduce(
      (acc, currValue) => {
        const localeName = currValue.split('subCategory')[1]?.toLowerCase();
        if (localeName) {
          // @ts-ignore
          acc[localeName] = data[currValue] as string;
        }
        return acc;
      },
      {} as Record<string, string>,
    );
    createDepartment.mutate({
      name: {
        ...subCategoryData,
      },
      parentCategoryId: data.department.value,
    });
    reset();
  };
  const handleEditSubCategory = (data: SubCategoryFormFields) => {
    const subCategoryData = Object.keys(data).reduce(
      (acc, currValue) => {
        const localeName = currValue.split('subCategory')[1]?.toLowerCase();
        if (localeName) {
          // @ts-ignore
          acc[localeName] = data[currValue] as string;
        }
        return acc;
      },
      {} as Record<string, string>,
    );
    editDepartment.mutate({
      departmentId: updateId,
      name: {
        ...subCategoryData,
      },
    });
    setCreateAnotherSubCategory(false);
    reset();
  };

  React.useEffect(() => {
    if (selectedData && selectedData?.id && selectedData?.category && isEdit) {
      setValue('department.label', selectedData.category.name.en ?? '');
      setSelectedOption(() => ({
        label: selectedData.category.name.en ?? '',
        value: selectedData.category.id,
      }));
      setValue('department.value', selectedData.category.id);
      Object.values(subCategoryObj).forEach((d) => {
        const locale = d.split('subCategory')[1]?.toLowerCase();
        if (locale) {
          const val = selectedData.name[locale];
          if (val) {
            // @ts-ignore
            setValue(d, val);
          }
        }
      });
    }
  }, [selectedData, setValue, isEdit]);

  const onFormSubmit: SubmitHandler<SubCategoryFormFields> = (
    data: SubCategoryFormFields,
  ) => {
    if (isEdit) {
      handleEditSubCategory(data);
    } else {
      handleCreateSubCategory(data);
    }
  };

  const shouldRenderProcedureError = countryData.some((c) => {
    const lang = subCategoryObj[c.language] as SubCategoryFormWithDepSchemaType;
    return (
      // @ts-ignore
      (errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message
    );
  });
  useScrollToError(errors);
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

      {/* <div className={procedureModalStyle.languageTabContainer}>
        {countryData.map((data) => {
          const lang = subCategoryObj[
            data.language
          ] as SubCategoryFormWithDepSchemaType;
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
                  ? // @ts-ignore
                    `px-3 py-2 ${procedureModalStyle.activeLanguageTab}  ${(errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message ? '!border-2 !border-error !text-error' : ''}`
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
      </div> */}

      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        className="w-full rounded-lg border-2 border-lightsilver px-4 py-3"
        type="text"
        placeholder="Enter sub-category name"
        onChange={(e) => {
          const { value } = e.target;
          // write the same value into every language field
          countryData.forEach((c) => {
            const lang = subCategoryObj[
              c.language
            ] as SubCategoryFormWithDepSchemaType;
            // @ts-ignore
            setValue(lang, value, { shouldValidate: true, shouldDirty: true });
          });
        }}
      />

      {/* {countryData.map((c) => {
        const lang = subCategoryObj[
          c.language
        ] as SubCategoryFormWithDepSchemaType;
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
      })} */}
      {shouldRenderProcedureError && (
        <div className="mb-5 mt-1 text-start font-lexend text-base font-normal text-error">
          Fill in details in all the languages
        </div>
      )}

      {/* {!isEdit && (
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
      )} */}

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
          className={`${createDepartment.isPending ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} mt-4 flex w-[280px] items-center justify-center rounded-lg px-4 py-[15px]`}
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
