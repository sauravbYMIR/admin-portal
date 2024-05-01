/* eslint-disable jsx-a11y/label-has-associated-control */
import { FbtButton } from '@frontbase/components-react';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { z } from 'zod';

import {
  useCreateHospitalMember,
  useEditHospitalMember,
  useGetHospitalTeamMemberById,
  useUpdateHospitalProfile,
} from '@/hooks/useMember';
import closeIcon from '@/public/assets/icons/close.svg';
import type { LanguagesType } from '@/types/components';
import { countryData } from '@/utils/global';

import modalStyle from './style.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalId: string;
  memberId: string;
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
  profile: z
    .custom<File>((v) => v instanceof File, {
      // message: 'Image is required',
    })
    .optional(),
});
export type CreateHospitalTeamMemberFormFields = z.infer<
  typeof createTeamMemberFormSchema
>;

function CreateHospitalTeamMemberModal({
  isOpen,
  onClose,
  hospitalId,
  memberId,
}: ModalProps) {
  const editHospitalMember = useEditHospitalMember();
  const memberByIdDetails = useGetHospitalTeamMemberById({ id: memberId });
  const [isAnotherMemberChecked, setIsAnotherMemberChecked] =
    React.useState<boolean>(false);
  const hospitalMember = useCreateHospitalMember();
  const updateHospitalProfile = useUpdateHospitalProfile();
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
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
  const onFormSubmit: SubmitHandler<CreateHospitalTeamMemberFormFields> = (
    data: CreateHospitalTeamMemberFormFields,
  ) => {
    if (memberId) {
      editHospitalMember.mutate({
        name: data.name,
        position: {
          en: data.positionEn,
          da: data.positionDa,
          nb: data.positionNb,
          sv: data.positionSv,
        },
        qualification: data.qualification,
        hospitalMemberId: memberId,
      });
    } else {
      hospitalMember.mutate({
        name: data.name,
        position: {
          en: data.positionEn,
          nb: data.positionNb,
          da: data.positionDa,
          sv: data.positionSv,
        },
        qualification: data.qualification,
        hospitalId,
      });
    }
    setActiveLanguageTab('English');
  };
  React.useEffect(() => {
    if (
      hospitalMember.isSuccess &&
      hospitalMember.data &&
      hospitalMember.data.data
    ) {
      const profile = getValues('profile');
      if (profile) {
        const formData = new FormData();
        formData.append('profile', profile as Blob);
        updateHospitalProfile.mutate({
          hospitalId,
          formData,
        });
      }
      if (isAnotherMemberChecked) {
        reset();
      } else {
        onClose();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalMember.data, hospitalMember.isSuccess]);
  React.useEffect(() => {
    if (
      memberId &&
      memberByIdDetails.isSuccess &&
      memberByIdDetails.data &&
      memberByIdDetails.data.success
    ) {
      setValue('name', memberByIdDetails.data.data.name);
      setValue('positionDa', memberByIdDetails.data.data.position.da);
      setValue('positionEn', memberByIdDetails.data.data.position.en);
      setValue('positionNb', memberByIdDetails.data.data.position.nb);
      setValue('positionSv', memberByIdDetails.data.data.position.sv);
      setValue('qualification', memberByIdDetails.data.data.qualification);
      // if (
      //   memberByIdDetails.data.data.profile &&
      //   typeof memberByIdDetails.data.data.profile === 'string'
      // ) {
      //   setValue('profile', memberByIdDetails.data.data.profile);
      // }
    }
  }, [memberByIdDetails.data, memberByIdDetails.isSuccess, setValue, memberId]);
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
                onClick={() => {
                  reset();
                  onClose();
                }}
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
                    const lang = hospitalObj[
                      data.language
                    ] as HospitalFormSchemaType;
                    return (
                      <button
                        key={data.locale}
                        type="button"
                        style={
                          data.language === activeLanguageTab
                            ? {
                                border: '1px solid rgba(9, 111, 144, 1)',
                                color: 'rgba(9, 111, 144, 1)',
                                backgroundColor: 'rgba(242, 250, 252, 1)',
                              }
                            : {}
                        }
                        onClick={() => setActiveLanguageTab(data.language)}
                        className={`${errors[lang] && errors[lang]?.message ? '!border !border-error !text-error' : ''}`}
                      >
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
              <Controller
                name="profile"
                control={control}
                render={({ field: { ref, name, onBlur, onChange } }) => (
                  <input
                    type="file"
                    ref={ref}
                    name={name}
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.files?.[0])}
                  />
                )}
              />
              {errors.profile && (
                <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                  {errors.profile.message}
                </small>
              )}
              {!memberId && (
                <div className={modalStyle.checkboxContainer}>
                  <input
                    className={modalStyle.checkbox}
                    type="checkbox"
                    name="another-member"
                    // value=""
                    checked={isAnotherMemberChecked}
                    onChange={() =>
                      setIsAnotherMemberChecked((prevState) => !prevState)
                    }
                  />
                  <label
                    htmlFor="another-member"
                    className={modalStyle.checkboxLabel}
                  >
                    Create another member
                  </label>
                </div>
              )}

              <FbtButton
                className={modalStyle.createMemberBtn}
                style={{ marginTop: '64px' }}
                variant="solid"
                size="sm"
                type="submit"
              >
                {hospitalMember.isPending || editHospitalMember.isPending ? (
                  <ClipLoader
                    loading={
                      hospitalMember.isPending || editHospitalMember.isPending
                    }
                    color="#fff"
                    size={30}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  <div>
                    {memberId ? <p>Save changes</p> : <p>Create member</p>}
                  </div>
                )}
              </FbtButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateHospitalTeamMemberModal;
