'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { FbtButton } from '@frontbase/components-react';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { z } from 'zod';

import {
  useCreateDepartment,
  useEditDepartment,
  useGetDepartmentById,
} from '@/hooks/useDepartment';
import closeIcon from '@/public/assets/icons/close.svg';
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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DepartmentFormFields>({
    resolver: zodResolver(DepartmentFormSchema),
  });
  const createDept = useCreateDepartment();
  const editDept = useEditDepartment();
  const reqdDept = useGetDepartmentById({ id: updateId });
  const [activeLanguageTab, setActiveLanguageTab] =
    useState<LanguagesType>('English');

  const shouldRenderProcedureError = countryData.some((c) => {
    const lang = departmentObj[c.language] as DepartmentFormSchemaType;
    return errors[lang] && errors[lang]?.message;
  });

  const onFormSubmit = (data: DepartmentFormFields) => {
    if (isEdit) {
      editDept.mutate({
        name: {
          en: data.nameDa,
          nb: data.nameNb,
          sv: data.nameSv,
          da: data.nameDa,
        },
        departmentId: updateId,
      });
    } else {
      createDept.mutate({
        name: {
          en: data.nameDa,
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

  return (
    <div>
      {isOpen && (
        <div className={departmentModalStyle.modalOverlay}>
          <div className={departmentModalStyle.modal}>
            <div className={departmentModalStyle.modalHeader}>
              <h2 className={departmentModalStyle.title}>
                {isEdit ? 'Edit department' : 'Create a department'}
              </h2>

              <Image
                className={departmentModalStyle.closeButton}
                src={closeIcon}
                alt="modal close icon"
                width={24}
                height={24}
                onClick={onClose}
              />
            </div>

            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className={departmentModalStyle.modalBody}
            >
              <label className={departmentModalStyle.departmentInputLabel}>
                Department name
              </label>

              <div className={departmentModalStyle.languageTabContainer}>
                {countryData.map((data) => {
                  return (
                    <button
                      key={data.locale}
                      onClick={() => setActiveLanguageTab(data.language)}
                      className={
                        activeLanguageTab === data.language
                          ? departmentModalStyle.activeLanguageTab
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
                const lang = departmentObj[
                  c.language
                ] as DepartmentFormSchemaType;
                return (
                  <div key={c.countryCode}>
                    {c.language === activeLanguageTab && (
                      <input
                        className={departmentModalStyle.departmentInput}
                        type="text"
                        placeholder="Enter department"
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
                  className={departmentModalStyle.departmentCheckboxContainer}
                >
                  <input
                    className={departmentModalStyle.checkbox}
                    type="checkbox"
                  />
                  <label className={departmentModalStyle.checkboxLabel}>
                    Create another department
                  </label>
                </div>
              )}

              {isEdit ? (
                <FbtButton
                  className={departmentModalStyle.createDepartmentBtn}
                  size="sm"
                  variant="solid"
                  type="submit"
                >
                  {editDept.isPending ? (
                    <ClipLoader
                      loading={editDept.isPending}
                      color="#fff"
                      size={30}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    <p className={departmentModalStyle.btnText}>Save changes</p>
                  )}
                </FbtButton>
              ) : (
                <FbtButton
                  className={departmentModalStyle.createDepartmentBtn}
                  size="sm"
                  variant="solid"
                  type="submit"
                >
                  {createDept.isPending ? (
                    <ClipLoader
                      loading={createDept.isPending}
                      color="#fff"
                      size={30}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    <p className={departmentModalStyle.btnText}>
                      Create department
                    </p>
                  )}
                </FbtButton>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentModal;
