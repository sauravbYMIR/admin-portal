/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { z } from 'zod';

import { CloseIcon, FileUploadIcon } from '@/components/Icons/Icons';
import departmentModalStyle from '@/components/Modal/DepartmentModal/departmentModal.module.scss';
import {
  useCreateHospitalMember,
  useEditHospitalMember,
  useGetHospitalTeamMemberById,
  useUpdateHospitalProfile,
} from '@/hooks/useMember';
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
  profile: z.instanceof(File).optional(),
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
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateHospitalTeamMemberFormFields>({
    resolver: zodResolver(createTeamMemberFormSchema),
  });
  const [showLogoOverlay, setShowLogoOverlay] = React.useState<boolean>(false);
  const profileRef = React.useRef<HTMLInputElement>(null);
  const editHospitalMember = useEditHospitalMember({ onClose });
  const memberByIdDetails = useGetHospitalTeamMemberById({ id: memberId });
  const [isAnotherMemberChecked, setIsAnotherMemberChecked] =
    React.useState<boolean>(false);
  const createHospitalMember = useCreateHospitalMember({
    closeModal: !isAnotherMemberChecked ? onClose : null,
  });
  const updateHospitalProfile = useUpdateHospitalProfile();
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');

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
      createHospitalMember.mutate({
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
    if (editHospitalMember.data && editHospitalMember.data.data) {
      const profile = getValues('profile');
      if (profile) {
        const formData = new FormData();
        formData.append('profile', profile as Blob);
        updateHospitalProfile.mutate({
          memberId: editHospitalMember.data.data,
          formData,
        });
      }
    }
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    memberId,
    hospitalId,
    createHospitalMember.data,
    createHospitalMember.isSuccess,
    isAnotherMemberChecked,
    editHospitalMember?.data?.data,
  ]);
  React.useEffect(() => {
    if (
      !memberId &&
      createHospitalMember.data &&
      createHospitalMember.data.data.id
    ) {
      const profile = getValues('profile');
      if (profile) {
        const formData = new FormData();
        formData.append('profile', profile as Blob);
        updateHospitalProfile.mutate({
          memberId: createHospitalMember.data.data.id,
          formData,
        });
      }
    }
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    memberId,
    hospitalId,
    createHospitalMember.data,
    createHospitalMember.isSuccess,
    isAnotherMemberChecked,
    editHospitalMember?.data?.data,
  ]);
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
  const profile = watch('profile');
  return (
    <div>
      {isOpen && (
        <div className={modalStyle.modalOverlay}>
          <div
            className={modalStyle.modal}
            style={{ paddingTop: '0px !important' }}
          >
            <div className="fixed flex w-[660px] items-start justify-between bg-white pt-8">
              <h2 className="font-poppins text-[32px] font-semibold text-neutral-1">
                {memberId ? (
                  <span>Edit a team member</span>
                ) : (
                  <span>Create a team member</span>
                )}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="absolute right-2 top-10"
              >
                <p className="hidden">text</p>
                <CloseIcon className="mb-2 size-6" strokeWidth={1.7} />
              </button>
            </div>

            <form
              className={modalStyle.modalBody}
              style={{
                marginTop: '120px',
              }}
              onSubmit={handleSubmit(onFormSubmit)}
            >
              <div className="mb-8 flex w-full flex-col items-start">
                <label
                  className="font-poppins text-base font-normal text-neutral-2"
                  htmlFor="position"
                >
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
                                border: '2px solid rgba(9, 111, 144, 1)',
                                color: 'rgba(9, 111, 144, 1)',
                                backgroundColor: 'rgba(242, 250, 252, 1)',
                              }
                            : {}
                        }
                        onClick={() => setActiveLanguageTab(data.language)}
                        className={`${errors[lang] && errors[lang]?.message ? '!border-2 !border-error !text-error' : ''}`}
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
                          // eslint-disable-next-line jsx-a11y/no-autofocus
                          autoFocus
                          className="w-full rounded-lg border-2 border-lightsilver px-4 py-3"
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
              <div className="mb-8 flex w-full flex-col items-start">
                <label
                  className="mb-3 font-poppins text-base font-normal text-neutral-2"
                  htmlFor="name"
                >
                  Full name
                </label>
                <input
                  id="name"
                  className="w-full rounded-lg border-2 border-lightsilver px-4 py-3"
                  type="text"
                  {...register('name')}
                />
                {errors.name && (
                  <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                    {errors.name.message}
                  </small>
                )}
              </div>
              <div className="mb-8 flex w-full flex-col items-start">
                <label
                  className="mb-3 font-poppins text-base font-normal text-neutral-2"
                  htmlFor="qualification"
                >
                  Qualification
                </label>
                <input
                  id="qualification"
                  className="w-full rounded-lg border-2 border-lightsilver px-4 py-3"
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
                render={({ field: { name, onBlur, onChange } }) => (
                  <button
                    type="button"
                    className="relative flex h-[180px] w-[205px] flex-col items-center justify-center rounded-lg border border-neutral-4 p-4"
                    onClick={() => profileRef.current?.click()}
                    onMouseEnter={() => setShowLogoOverlay(true)}
                    onMouseLeave={() => setShowLogoOverlay(false)}
                  >
                    {showLogoOverlay && profile && (
                      <div
                        className="absolute left-0 top-0 flex size-full flex-col items-center justify-center rounded-full"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        }}
                      >
                        <div className="flex size-10 items-center justify-center rounded-full border border-white p-2">
                          <FileUploadIcon stroke="#fff" />
                        </div>
                        <p className="mt-3 font-poppins text-sm font-medium text-white">
                          Replace image
                        </p>
                        <p className="font-lexend text-sm font-normal text-white">
                          PNG, JPG (max. 10 MB)
                        </p>
                      </div>
                    )}
                    {!getValues('profile') && (
                      <div className="flex size-10 items-center justify-center rounded-full border border-darkgray p-2">
                        <FileUploadIcon />
                      </div>
                    )}
                    <input
                      type="file"
                      ref={profileRef}
                      name={name}
                      onBlur={onBlur}
                      accept="image/*"
                      // onChange={(e) => onChange(e.target.files?.[0])}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                      }}
                      className="invisible absolute"
                    />
                    {profile ? (
                      <Image
                        src={`${URL.createObjectURL(profile)}`}
                        alt="team-member-profile"
                        key={`${profile}`}
                        fill
                        priority
                        unoptimized
                        style={{ backgroundImage: 'contain' }}
                        className="inline-block rounded-lg"
                      />
                    ) : (
                      <div>
                        {memberByIdDetails.data &&
                        memberByIdDetails.data.data &&
                        typeof memberByIdDetails.data.data.profile ===
                          'string' ? (
                          <>
                            <Image
                              src={`${memberByIdDetails.data.data.profile}?version=${new Date().getTime()}`}
                              alt="team-member-profile-from-server"
                              key={`${memberByIdDetails.data.data.id}`}
                              fill
                              priority
                              unoptimized
                              style={{ backgroundImage: 'contain' }}
                              className="inline-block rounded-lg"
                            />
                            <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-y-4 rounded-lg bg-black/25">
                              <p className="mt-3 font-poppins text-sm font-medium text-white">
                                Replace image
                              </p>
                              <FileUploadIcon
                                stroke="#fff"
                                className="size-12 rounded-full border border-white p-2"
                              />

                              <p className="font-lexend text-sm font-normal text-white">
                                PNG, JPG (max. 10 MB)
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="mt-3 font-poppins text-sm font-medium text-darkgray">
                              Click to upload a image
                            </p>
                            <p className="font-lexend text-sm font-normal text-neutral-3">
                              PNG, JPG (max. 10 MB)
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </button>
                )}
              />
              <div className="mt-2" />
              {errors.profile && (
                <small className="text-start font-lexend text-base font-normal text-error">
                  {errors.profile.message}
                </small>
              )}
              {!memberId && (
                <div className="mt-16">
                  <label
                    className={departmentModalStyle.checkboxLabel}
                    htmlFor="another-member"
                  >
                    <span className="absolute top-[-2px]">
                      Create another member
                    </span>
                    <input
                      className={departmentModalStyle.checkboxStyle}
                      type="checkbox"
                      checked={isAnotherMemberChecked}
                      id="another-member"
                      onChange={() =>
                        setIsAnotherMemberChecked((prevState) => !prevState)
                      }
                    />
                    <span className={departmentModalStyle.checkmark} />
                  </label>
                </div>
              )}

              <button
                className={`${createHospitalMember.isPending || editHospitalMember.isPending ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} mt-7 flex w-[280px] items-center justify-center rounded-lg px-4 py-[15px]`}
                type="submit"
              >
                {createHospitalMember.isPending ||
                editHospitalMember.isPending ? (
                  <ClipLoader
                    loading={
                      createHospitalMember.isPending ||
                      editHospitalMember.isPending
                    }
                    color="#fff"
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  <div>
                    {memberId ? (
                      <p className="font-poppins text-sm font-bold text-white">
                        Save changes
                      </p>
                    ) : (
                      <p className="font-poppins text-sm font-bold text-white">
                        Create member
                      </p>
                    )}
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateHospitalTeamMemberModal;
