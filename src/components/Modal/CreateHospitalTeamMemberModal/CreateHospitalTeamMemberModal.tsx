/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { z } from 'zod';

import { CloseIcon, FileUploadIcon } from '@/components/Icons/Icons';
import ImageCropperModal from '@/components/ImageCropperModal/ImageCropperModal';
import departmentModalStyle from '@/components/Modal/DepartmentModal/departmentModal.module.scss';
import {
  useCreateHospitalMember,
  useEditHospitalMember,
  useGetHospitalTeamMemberById,
  useUpdateHospitalProfile,
} from '@/hooks/useMember';
import useScrollToError from '@/hooks/useScrollToError';
import type { LanguagesType } from '@/types/components';
import {
  countryData,
  handleFileSetter,
  positionObj,
  PositionSchema,
  qualificationObj,
  QualificationSchema,
} from '@/utils/global';

import type { Locale } from '../DepartmentModal/DepartmentModal';
import modalStyle from './style.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalId: string;
  memberId: string;
}

export type PositionFormSchemaType = `position${Capitalize<Locale>}`;
export type HospitalQualificationFormSchemaType =
  `qualification${Capitalize<Locale>}`;

type FormErrors = {
  [key in PositionFormSchemaType]?: { message?: string };
} & {
  [key in HospitalQualificationFormSchemaType]?: { message?: string };
};

const createTeamMemberFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  ...QualificationSchema,
  ...PositionSchema,
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
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateHospitalTeamMemberFormFields>({
    resolver: zodResolver(createTeamMemberFormSchema),
  });
  const [showLogoOverlay, setShowLogoOverlay] = React.useState<boolean>(false);
  const profileRef = React.useRef<HTMLInputElement>(null);
  const [profileImg, setProfileImg] = React.useState<File | null>(null);
  const [isModalActive, setIsModalActive] = React.useState<boolean>(false);
  const editHospitalMember = useEditHospitalMember({ onClose, reset });
  const memberByIdDetails = useGetHospitalTeamMemberById({ id: memberId });
  const [isAnotherMemberChecked, setIsAnotherMemberChecked] =
    React.useState<boolean>(false);
  const createHospitalMember = useCreateHospitalMember({
    closeModal: !isAnotherMemberChecked ? onClose : null,
  });
  const updateHospitalProfile = useUpdateHospitalProfile();
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');
  const [activeLanguageQualificationTab, setActiveLanguageQualificationTab] =
    React.useState<LanguagesType>('English');

  const shouldRenderError = countryData.some((c) => {
    const lang = positionObj[c.language] as PositionFormSchemaType;
    return (
      (errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message
    );
  });
  const shouldRenderQualificationError = countryData.some((c) => {
    const lang = qualificationObj[
      c.language
    ] as HospitalQualificationFormSchemaType;
    return (
      (errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message
    );
  });
  const onFormSubmit: SubmitHandler<CreateHospitalTeamMemberFormFields> = (
    data: CreateHospitalTeamMemberFormFields,
  ) => {
    const positionDataObj = Object.keys(data).reduce(
      (acc, curr) => {
        const value =
          curr.split('position').length > 0
            ? curr.split('position')[1]?.toLowerCase()
            : '';
        if (value) {
          // @ts-ignore
          acc[value] = data[curr];
        }
        return acc;
      },
      {} as Record<string, string>,
    );
    const qualificatonDataObj = Object.keys(data).reduce(
      (acc, curr) => {
        const value =
          curr.split('qualification').length > 0
            ? curr.split('qualification')[1]?.toLowerCase()
            : '';
        if (value) {
          // @ts-ignore
          acc[value] = data[curr];
        }
        return acc;
      },
      {} as Record<string, string>,
    );
    if (memberId) {
      editHospitalMember.mutate({
        name: data.name,
        position: {
          ...positionDataObj,
        },
        qualification: {
          ...qualificatonDataObj,
        },
        hospitalMemberId: memberId,
      });
      if (profileImg) {
        const formData = new FormData();
        formData.append('profile', profileImg as Blob);
        updateHospitalProfile.mutate({
          memberId,
          formData,
        });
        reset();
      }
    } else {
      createHospitalMember.mutate({
        name: data.name,
        position: {
          ...positionDataObj,
        },
        qualification: {
          ...qualificatonDataObj,
        },
        hospitalId,
      });
    }
    setActiveLanguageTab('English');
  };
  React.useEffect(() => {
    if (editHospitalMember.data && editHospitalMember.data.data) {
      if (profileImg) {
        const formData = new FormData();
        formData.append('profile', profileImg as Blob);
        updateHospitalProfile.mutate({
          memberId: editHospitalMember.data.data,
          formData,
        });
        reset();
      }
    }
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
      if (profileImg) {
        const formData = new FormData();
        formData.append('profile', profileImg as Blob);
        updateHospitalProfile.mutate({
          memberId: createHospitalMember.data.data.id,
          formData,
        });
        reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    memberId,
    hospitalId,
    createHospitalMember.data,
    createHospitalMember.isSuccess,
    isAnotherMemberChecked,
    editHospitalMember.isSuccess,
  ]);
  React.useEffect(() => {
    if (
      memberId &&
      memberByIdDetails.isSuccess &&
      memberByIdDetails.data &&
      memberByIdDetails.data.success
    ) {
      setValue('name', memberByIdDetails.data.data.name);
      Object.values(positionObj).forEach((d) => {
        const locale = d.split('position')[1]?.toLowerCase();
        if (locale) {
          const val = memberByIdDetails.data.data.position[locale];
          if (val) {
            // @ts-ignore
            setValue(d as keyof CreateHospitalTeamMemberFormFields, val);
          }
        }
      });
      Object.values(qualificationObj).forEach((d) => {
        const locale = d.split('qualification')[1]?.toLowerCase();
        if (locale && memberByIdDetails.data.data?.qualification) {
          const val = memberByIdDetails.data.data?.qualification[locale];
          if (val) {
            setValue(d as keyof CreateHospitalTeamMemberFormFields, val);
          }
        }
      });
    }
  }, [memberByIdDetails.data, memberByIdDetails.isSuccess, setValue, memberId]);
  useScrollToError(errors);
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
                onClick={() => {
                  onClose();
                  setActiveLanguageTab('English');
                  reset();
                }}
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
                    const lang = positionObj[
                      data.language
                    ] as PositionFormSchemaType;
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
                        className={`${(errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message ? '!border-2 !border-error !text-error' : ''}`}
                      >
                        {data.language}
                      </button>
                    );
                  })}
                </div>
                {countryData.map((c) => {
                  const lang = positionObj[
                    c.language
                  ] as PositionFormSchemaType;
                  return (
                    <div key={c.countryCode} className="w-full">
                      {c.language === activeLanguageTab && (
                        <input
                          // eslint-disable-next-line jsx-a11y/no-autofocus
                          autoFocus
                          className="w-full rounded-lg border-2 border-lightsilver px-4 py-3"
                          type="text"
                          id="position"
                          // @ts-ignore
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
                <div className={modalStyle.languageTabContainer}>
                  {countryData.map((data) => {
                    const lang = qualificationObj[
                      data.language
                    ] as HospitalQualificationFormSchemaType;
                    return (
                      <button
                        key={data.locale}
                        type="button"
                        style={
                          data.language === activeLanguageQualificationTab
                            ? {
                                border: '2px solid rgba(9, 111, 144, 1)',
                                color: 'rgba(9, 111, 144, 1)',
                                backgroundColor: 'rgba(242, 250, 252, 1)',
                              }
                            : {}
                        }
                        onClick={() =>
                          setActiveLanguageQualificationTab(data.language)
                        }
                        className={`${(errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message ? '!border-2 !border-error !text-error' : ''}`}
                      >
                        {data.language}
                      </button>
                    );
                  })}
                </div>
                {countryData.map((c) => {
                  const lang = qualificationObj[
                    c.language
                  ] as HospitalQualificationFormSchemaType;
                  return (
                    <div key={c.countryCode} className="w-full">
                      {c.language === activeLanguageQualificationTab && (
                        <input
                          // eslint-disable-next-line jsx-a11y/no-autofocus
                          autoFocus
                          className="w-full rounded-lg border-2 border-lightsilver px-4 py-3"
                          type="text"
                          id="qualification"
                          // @ts-ignore
                          {...register(lang)}
                        />
                      )}
                    </div>
                  );
                })}

                {shouldRenderQualificationError && (
                  <small className="mb-5 mt-1 text-start font-lexend text-base font-normal text-error">
                    Fill in details in all the languages
                  </small>
                )}
              </div>
              <Controller
                name="profile"
                control={control}
                render={({ field: { name, onBlur, onChange } }) => (
                  <button
                    type="button"
                    className="relative flex h-[200px] w-[205px] flex-col items-center justify-center rounded-lg border border-neutral-4 p-4"
                    onClick={() =>
                      !isModalActive && profileRef.current?.click()
                    }
                    onMouseEnter={() => setShowLogoOverlay(true)}
                    onMouseLeave={() => setShowLogoOverlay(false)}
                  >
                    {showLogoOverlay && profileImg && (
                      <div
                        className="absolute left-0 top-0 z-10 flex size-full flex-col items-center justify-center"
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
                    {!profileImg && (
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
                    <input
                      type="file"
                      accept="image/*"
                      className="invisible absolute"
                      ref={profileRef}
                      onChange={(e) => {
                        handleFileSetter({
                          e,
                          imageSetter: setProfileImg,
                          setIsModalActive,
                        });
                      }}
                    />
                    {isModalActive && (
                      <ImageCropperModal
                        imageRef={profileRef}
                        imageFile={profileImg}
                        heading="Adjust your profile"
                        setIsModalActive={setIsModalActive}
                        imageSetter={setProfileImg}
                        aspectRatio={{ w: 846, h: 150 }}
                        // handleUploadType="LOGO"
                      />
                    )}
                    {profileImg ? (
                      <Image
                        src={`${URL.createObjectURL(profileImg)}`}
                        alt="team-member-profile"
                        key={`${profileImg}`}
                        fill
                        priority
                        unoptimized
                        className="inline-block aspect-square rounded-lg object-contain"
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
                              className="inline-block aspect-square rounded-lg object-contain"
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
                              click to upload an image
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
