/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { z } from 'zod';

import { CloseIcon } from '@/components/Icons/Icons';
import {
  useCreateDepartment,
  useEditDepartment,
  useGetDepartmentById,
} from '@/hooks/useDepartment';
import type { LanguagesType } from '@/types/components';
import { countryData } from '@/utils/global';

import departmentModalStyle from './departmentModal.module.scss';

export type DepartmentFormSchemaType =
  | 'nameEn'
  | 'nameNb'
  | 'nameDa'
  | 'nameSv';

const departmentObj = {
  English: 'nameEn',
  Norwegian: 'nameNb',
  Danish: 'nameDa',
  Swedish: 'nameSv',
};

const DepartmentFormSchema = z.object({
  nameEn: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  nameNb: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  nameDa: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  nameSv: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
});
export type DepartmentFormFields = z.infer<typeof DepartmentFormSchema>;

export type DeptNameFormSchemaType = 'nameEn' | 'nameDa' | 'nameSv' | 'nameNb';
interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  updateId: string;
}

function DepartmentModal({
  isOpen,
  onClose,
  isEdit,
  updateId,
}: DepartmentModalProps) {
  const deptObj = {
    English: 'nameEn',
    Norwegian: 'nameNb',
    Danish: 'nameDa',
    Swedish: 'nameSv',
  };
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DepartmentFormFields>({
    resolver: zodResolver(DepartmentFormSchema),
  });

  const editDept = useEditDepartment({ isSubCat: false, onClose });
  const reqdDept = useGetDepartmentById({ id: updateId });
  const [activeLanguageTab, setActiveLanguageTab] =
    useState<LanguagesType>('English');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const createDept = useCreateDepartment({
    isCreateSubCategory: false,
    closeModal: !isChecked ? onClose : null,
  });
  const shouldRenderProcedureError = countryData.some((c) => {
    const lang = departmentObj[c.language] as DepartmentFormSchemaType;
    return errors[lang] && errors[lang]?.message;
  });

  const onFormSubmit = (data: DepartmentFormFields) => {
    if (isEdit) {
      editDept.mutate({
        name: {
          en: data.nameEn,
          nb: data.nameNb,
          sv: data.nameSv,
          da: data.nameDa,
        },
        departmentId: updateId,
      });
    } else {
      createDept.mutate({
        name: {
          en: data.nameEn,
          nb: data.nameNb,
          sv: data.nameSv,
          da: data.nameDa,
        },
        parentCategoryId: '',
      });
    }
  };
  React.useEffect(() => {
    if (
      updateId &&
      reqdDept.isSuccess &&
      reqdDept.data &&
      reqdDept.data.success
    ) {
      setValue('nameEn', reqdDept.data.data.name.en);
      setValue('nameDa', reqdDept.data.data.name.da);
      setValue('nameSv', reqdDept.data.data.name.sv);
      setValue('nameNb', reqdDept.data.data.name.nb);
    }
  }, [reqdDept.data, reqdDept.isSuccess, setValue, updateId]);
  React.useEffect(() => {
    if (isChecked && (createDept.isSuccess || editDept.isSuccess)) {
      reset();
    }
  }, [createDept.isSuccess, editDept.isSuccess, isChecked, onClose, reset]);

  return (
    <div>
      {isOpen && (
        <div className={departmentModalStyle.modalOverlay}>
          <div className={departmentModalStyle.modal}>
            <div className={departmentModalStyle.modalHeader}>
              <h2 className="font-poppins text-lg font-semibold text-neutral-1">
                {isEdit ? 'Edit department' : 'Create a department'}
              </h2>

              <button
                type="button"
                className="cursor-pointer"
                onClick={() => {
                  reset();
                  onClose();
                }}
              >
                <CloseIcon className="mb-2 size-6" strokeWidth={1.7} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className={departmentModalStyle.modalBody}
            >
              <label className="font-poppins text-base font-normal text-neutral-2">
                Department name
              </label>

              <div className={departmentModalStyle.languageTabContainer}>
                {countryData.map((data) => {
                  const lang = deptObj[data.language] as DeptNameFormSchemaType;
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
                      type="button"
                      className={`px-3 py-2 ${errors[lang] && errors[lang]?.message ? '!border !border-error !text-error' : ''}`}
                    >
                      <span className="font-poppins text-sm font-medium text-darkteal">
                        {data.language}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mb-10 flex w-full flex-col items-start">
                {countryData.map((c) => {
                  const lang = departmentObj[
                    c.language
                  ] as DepartmentFormSchemaType;
                  return (
                    <div key={c.countryCode} className="w-full">
                      {c.language === activeLanguageTab && (
                        <input
                          className="w-full rounded-lg border-2 border-lightsilver px-4 py-3"
                          type="text"
                          // eslint-disable-next-line jsx-a11y/no-autofocus
                          autoFocus
                          placeholder="Enter department name"
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
              </div>

              {!isEdit && (
                <div className="relative mb-7 flex items-center">
                  <label className={departmentModalStyle.checkboxLabel}>
                    <span className="absolute top-[-2px]">
                      Create another department
                    </span>
                    <input
                      className={departmentModalStyle.checkboxStyle}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => setIsChecked((prevState) => !prevState)}
                    />
                    <span className={departmentModalStyle.checkmark} />
                  </label>
                </div>
              )}

              {isEdit ? (
                <button
                  className={`${editDept.isPending ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} flex w-[280px] items-center justify-center rounded-lg px-4 py-[15px]`}
                  type="submit"
                >
                  {editDept.isPending ? (
                    <ClipLoader
                      loading={editDept.isPending}
                      color="#fff"
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    <p className="font-poppins text-sm font-bold text-white">
                      Save changes
                    </p>
                  )}
                </button>
              ) : (
                <button
                  className={`${createDept.isPending ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} flex w-[280px] items-center justify-center rounded-lg px-4 py-[15px]`}
                  type="submit"
                >
                  {createDept.isPending ? (
                    <ClipLoader
                      loading={createDept.isPending}
                      color="#fff"
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    <p className="font-poppins text-sm font-bold text-white">
                      Create department
                    </p>
                  )}
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentModal;
