/* eslint-disable jsx-a11y/label-has-associated-control */
import { FbtButton, FbtFileUpload } from '@frontbase/components-react';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import closeIcon from '@/public/assets/icons/close.svg';
import type { LanguagesType } from '@/types/components';
import { countryData } from '@/utils/global';

import modalStyle from './style.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type HospitalFormSchemaType =
  | 'positionEn'
  | 'positionNb'
  | 'positionDa'
  | 'positionSv';

const createTeamMemberFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  qualification: z.string().min(1, { message: 'Qualification is required' }),
  positionEn: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  positionNb: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  positionDa: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  positionSv: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
});
export type CreateHospitalTeamMemberFormFields = z.infer<
  typeof createTeamMemberFormSchema
>;

function CreateHospitalTeamMemberModal({ isOpen, onClose }: ModalProps) {
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateHospitalTeamMemberFormFields>({
    resolver: zodResolver(createTeamMemberFormSchema),
  });
  const hospitalObj = {
    English: 'positionEn',
    Norwegian: 'positionNb',
    Danish: 'positionDa',
    Swedish: 'positionSv',
  };
  const shouldRenderError = countryData.some((c) => {
    const lang = hospitalObj[c.language] as HospitalFormSchemaType;
    return errors[lang] && errors[lang]?.message;
  });
  const handleCreateHospitalTeamMember = () => {
    // API call to create sub category
    setActiveLanguageTab('English');
  };
  const handleEditHospitalTeamMember = () => {
    // API call to create sub category
    setActiveLanguageTab('English');
  };
  const onFormSubmit: SubmitHandler<
    CreateHospitalTeamMemberFormFields
  > = () => {
    // TODO: WIP
    handleCreateHospitalTeamMember();
    handleEditHospitalTeamMember();
  };
  return (
    <div>
      {isOpen && (
        <div className={modalStyle.modalOverlay}>
          <div className={modalStyle.modal}>
            <div className={modalStyle.modalHeader}>
              <h2 className={modalStyle.title}>Create a team member</h2>

              <Image
                className={modalStyle.closeButton}
                src={closeIcon}
                alt="modal close icon"
                width={24}
                height={24}
                onClick={onClose}
              />
            </div>

            <form
              className={modalStyle.modalBody}
              onSubmit={handleSubmit(onFormSubmit)}
            >
              <div className="mb-10 flex w-full flex-col items-start">
                <label className={modalStyle.label} htmlFor="position">
                  Position
                </label>

                <div className={modalStyle.languageTabContainer}>
                  {countryData.map((data) => {
                    return (
                      <button key={data.locale} type="button">
                        {data.language}
                      </button>
                    );
                  })}
                </div>
                {countryData.map((c) => {
                  const lang = hospitalObj[
                    c.language
                  ] as HospitalFormSchemaType;
                  return (
                    <div key={c.countryCode} className="w-full">
                      {c.language === activeLanguageTab && (
                        <input
                          className={modalStyle.input}
                          type="text"
                          id="position"
                          {...register(lang)}
                        />
                      )}
                    </div>
                  );
                })}

                {shouldRenderError && (
                  <small className="mb-5 mt-1 text-start font-lexend text-base font-normal text-error">
                    Fill in details in all the languages
                  </small>
                )}
              </div>
              <div className="mb-10 flex w-full flex-col items-start">
                <label className={`${modalStyle.label} mb-2`} htmlFor="name">
                  Name & surname
                </label>
                <input
                  id="name"
                  className={modalStyle.input}
                  style={{ margin: '8px 0 8px' }}
                  type="text"
                  {...register('name')}
                />
                {errors.name && (
                  <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                    {errors.name.message}
                  </small>
                )}
              </div>
              <div className="mb-10 flex w-full flex-col items-start">
                <label
                  className={`${modalStyle.label} mb-2`}
                  htmlFor="qualification"
                >
                  Qualification
                </label>
                <input
                  id="qualification"
                  className={modalStyle.input}
                  type="text"
                  {...register('qualification')}
                />
                {errors.qualification && (
                  <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                    {errors.qualification.message}
                  </small>
                )}
              </div>

              <FbtFileUpload message="PNG, JPG  (max. 10 MB)" />

              <div className={modalStyle.checkboxContainer}>
                <input className={modalStyle.checkbox} type="checkbox" />
                <label className={modalStyle.checkboxLabel}>
                  Create another member
                </label>
              </div>

              <FbtButton
                className={modalStyle.createMemberBtn}
                variant="solid"
                size="sm"
                type="submit"
              >
                {isSubmitting ? <p>Loading...</p> : <p>Create member</p>}
              </FbtButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateHospitalTeamMemberModal;
