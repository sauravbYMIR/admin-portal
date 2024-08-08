/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */

'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { z } from 'zod';

import {
  BackArrowIcon,
  CreateHospitalTeamMemberModal,
  EditIcon,
  FacebookStyleLoader,
  Header,
  PlusIcon,
  TeamMemberCard,
  WithAuth,
} from '@/components';
import { useGetHospitalById } from '@/hooks';
import arrowForward from '@/public/assets/icons/arrowForward.svg';
import hospitalLogo from '@/public/assets/icons/sampleLogo.svg';
import emptyTeamMember from '@/public/assets/images/emptyTeamMember.svg';
import { handleSetLocalStorage } from '@/utils/global';

import style from './hospitalDetailPage.module.scss';

export type HospitalTeamMemberFormSchemaType =
  | 'hospitalDescEn'
  | 'hospitalDescNb'
  | 'hospitalDescDa'
  | 'hospitalDescSv';

const teamMemberTypeSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const createHospitalTeamMemberFormSchema = z.object({
  roleEn: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  roleNb: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  roleDa: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  roleSv: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  member: teamMemberTypeSchema,
});
export type CreateHospitalTeamMemberFormFields = z.infer<
  typeof createHospitalTeamMemberFormSchema
>;

function HospitalDetailsPage({ params: { id } }: { params: { id: string } }) {
  const pathname = usePathname();
  const hospitalId = pathname.split('/')[3];
  const hospitalById = useGetHospitalById({ id: hospitalId ?? '' });
  const [isCreateHospitalTeamModal, setIsCreateHospitalTeamModal] =
    useState<boolean>(false);
  const [isEditTeamMember, setIsEditTeamMember] = useState<boolean>(false);
  const [teamMemberId, setTeamMemberId] = useState<string>('');

  const router = useRouter();
  React.useEffect(() => {
    if (hospitalById?.data?.data.country) {
      handleSetLocalStorage({
        tokenKey: 'hospital_country',
        tokenValue: hospitalById.data.data.country,
      });
    }
  }, [hospitalById?.data?.data.country]);

  return (
    <div>
      <Header />

      <div className={style.hospitalDetailPageContainer}>
        <button
          type="button"
          onClick={() => router.push('/hospitals')}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full border-none bg-rgba244"
        >
          <BackArrowIcon strokeWidth="2" stroke="rgba(17, 17, 17, 0.8)" />
        </button>

        {hospitalById.isLoading ? (
          <FacebookStyleLoader />
        ) : (
          <>
            <div className={style.headerSection}>
              <div className={style.titleContainer}>
                {hospitalById &&
                hospitalById.data &&
                hospitalById.data.data &&
                typeof hospitalById.data.data.logo === 'string' ? (
                  <Image
                    className="aspect-square rounded-full border border-lightsilver object-contain"
                    src={`${hospitalById.data.data.logo}?version=${new Date().getTime()}`}
                    alt="hospital logo"
                    width={100}
                    height={100}
                    unoptimized
                    priority
                  />
                ) : (
                  <Image
                    className="rounded-full"
                    width={100}
                    height={100}
                    src={hospitalLogo}
                    alt="hospital-logo"
                  />
                )}

                <div className={style.titleBreadCrumbContainer}>
                  {hospitalById.isSuccess && hospitalById.data.data && (
                    <h3 className="font-poppins text-[30px] font-medium text-darkslategray">
                      {hospitalById.data.data.name}
                    </h3>
                  )}

                  <div className={style.breadcrumb}>
                    <button
                      className="cursor-pointer"
                      onClick={() => router.push('/hospitals')}
                      type="button"
                    >
                      <span className="font-lexend text-base font-normal text-neutral-3">
                        Hospitals
                      </span>
                    </button>
                    <span>/</span>
                    <button type="button">
                      <span className="font-lexend text-base font-normal text-darkteal">
                        Details
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="mt-6 flex cursor-pointer items-center gap-x-[10px] rounded-lg border-2 border-darkteal p-3"
                type="button"
                onClick={() => router.push(`/hospitals/edit/${id}`)}
              >
                <EditIcon className="size-5" stroke="rgba(9, 111, 144, 1)" />
                <p className="font-poppins text-sm font-semibold text-darkteal">
                  Edit Details
                </p>
              </button>
            </div>

            <h3 className="mb-4 font-poppins text-[18px] font-medium text-rgba77">
              About the hospital
            </h3>
            {hospitalById.isSuccess && hospitalById.data.data && (
              <p className="mb-12 font-lexend text-base font-light text-neutral-3">
                {hospitalById.data.data.description.en}
              </p>
            )}

            <h3 className="mb-4 font-poppins text-[18px] font-medium text-rgba77">
              Address
            </h3>

            {hospitalById.isSuccess && hospitalById.data.data && (
              <div className="mb-12 flex flex-col items-start gap-y-[2px]">
                <div className="flex items-center gap-x-2">
                  <p className="font-lexend text-base font-light text-neutral-3">
                    {hospitalById.data.data.streetNumber}
                  </p>
                  <p className="font-lexend text-base font-light text-neutral-3">
                    {hospitalById.data.data.streetName},
                  </p>
                </div>
                <p className="font-lexend text-base font-light text-neutral-3">
                  {hospitalById.data.data.city}
                </p>
                <p className="font-lexend text-base font-light text-neutral-3">
                  {hospitalById.data.data.country}
                </p>
                <p className="font-lexend text-base font-light text-neutral-3">
                  {hospitalById.data.data.zipcode}
                </p>
              </div>
            )}

            <h3 className="mb-7 font-poppins text-[18px] font-medium text-rgba77">
              Hospital gallery
            </h3>

            {hospitalById.isSuccess &&
            hospitalById.data.data &&
            Array.isArray(hospitalById.data.data.hospitalImages) &&
            hospitalById.data.data.hospitalImages.length > 0 ? (
              <div className="mb-12 mt-7 flex w-full flex-wrap items-center gap-4">
                {hospitalById.data.data.hospitalImages.map((file) => {
                  return (
                    <Image
                      key={file.id}
                      src={`${file.imageUrl}?version=${new Date().getTime()}`}
                      width={260}
                      height={250}
                      alt="hospital-gallery"
                      unoptimized
                      priority
                      className="aspect-square h-[250px] w-[260px] rounded-lg border border-stone-400 object-contain"
                    />
                  );
                })}
              </div>
            ) : (
              <p className={`${style.title} mb-12`}>No images uploaded</p>
            )}

            <h3 className="mb-7 font-poppins text-[18px] font-medium text-rgba77">
              Team members
            </h3>

            {hospitalById.isSuccess && hospitalById.data.data && (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {hospitalById.data.data.members.length === 0 ? (
                  <div className="mb-12 flex w-full flex-col items-start">
                    <div
                      className="flex w-full flex-col items-center justify-center rounded-xl border py-10"
                      style={{
                        borderColor: 'rgba(186, 191, 199, 1)',
                      }}
                    >
                      <Image
                        src={emptyTeamMember}
                        alt="empty-team-member-list"
                        width={160}
                        height={160}
                        className="size-[160px]"
                      />
                      <p className="mb-7 mt-3 font-poppins text-base font-normal text-neutral-2">
                        No team member have been added yet!
                      </p>
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-3 rounded-lg bg-darkteal px-6 py-[14px]"
                        onClick={() => setIsCreateHospitalTeamModal(true)}
                      >
                        <PlusIcon className="size-5" stroke="#fff" />
                        <p className="font-poppins text-base font-semibold text-primary-6">
                          Create team members
                        </p>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={style.teamMemberViewSection}>
                    <div className={style.headerSection}>
                      <button
                        className={style.addBtn}
                        onClick={() => setIsCreateHospitalTeamModal(true)}
                      >
                        <PlusIcon className="size-5" stroke="#fff" />
                        <p>Add a team member</p>
                      </button>

                      {isEditTeamMember ? (
                        <button
                          className={style.editBtn}
                          onClick={() => setIsEditTeamMember(false)}
                        >
                          <EditIcon
                            className="size-5"
                            stroke="rgba(9, 111, 144, 1)"
                          />
                          <p>Cancel editing</p>
                        </button>
                      ) : (
                        <button
                          className={style.editBtn}
                          onClick={() => setIsEditTeamMember(true)}
                        >
                          <EditIcon
                            className="size-5"
                            stroke="rgba(9, 111, 144, 1)"
                          />
                          <p>Edit team members</p>
                        </button>
                      )}
                    </div>

                    <div className={style.teamMemberCardsContainer}>
                      {hospitalById.data.data.members.map((member) => {
                        return (
                          <TeamMemberCard
                            hospitalId={id}
                            teamMemberId={member.id}
                            name={member.name}
                            qualification={member.qualification}
                            role={member.position.en}
                            key={member.id}
                            isEdit={isEditTeamMember}
                            onOpen={() => {
                              setTeamMemberId(member.id);
                              setIsCreateHospitalTeamModal(true);
                            }}
                            profile={
                              member.profilePictureUploaded
                                ? member.profile
                                : false
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            <h3 className="mb-7 font-poppins text-[18px] font-medium text-rgba77">
              Procedures
            </h3>

            <div className="flex w-[525px] flex-col items-start rounded-lg border border-lightskyblue bg-primary-6 px-6 py-8">
              <h2 className="mb-6 font-poppins text-[28px] font-medium text-darkteal">
                Procedure management
              </h2>
              <button
                onClick={() =>
                  router.push(`/hospitals/add/${hospitalId}/procedures`)
                }
                className="flex items-center gap-x-2 border-b-2 border-darkteal pb-1"
                type="button"
              >
                <p className="font-poppins text-base font-semibold text-darkteal">
                  View all
                </p>
                <Image src={arrowForward} alt="arrow forward icon" />
              </button>
            </div>

            <CreateHospitalTeamMemberModal
              isOpen={isCreateHospitalTeamModal}
              onClose={() => {
                // setIsEditTeamMember(false);
                setTeamMemberId('');
                setIsCreateHospitalTeamModal(false);
              }}
              hospitalId={id}
              memberId={teamMemberId}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default WithAuth(HospitalDetailsPage);
