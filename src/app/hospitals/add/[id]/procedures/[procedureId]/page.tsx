/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { z } from 'zod';

import {
  BackArrowIcon,
  CreateHospitalTeamMemberModal,
  EditIcon,
  FacebookStyleLoader,
  Header,
  SearchIcon,
  TeamMemberCard,
  WithAuth,
} from '@/components';
import { useGetHospitalProcedureById } from '@/hooks/useHospitalProcedure';
import editIcon from '@/public/assets/icons/edit.svg';
import plusIcon from '@/public/assets/icons/plus.svg';

import style from '../../hospitalDetailPage.module.scss';

// import addHospitalStyle from './style.module.scss';

export type HospitalFormSchemaType =
  | 'hospitalDescEn'
  | 'hospitalDescNb'
  | 'hospitalDescDa'
  | 'hospitalDescSv';

const createHospitalFormSchema = z.object({
  hospitalName: z.string().min(1, { message: 'Hospital name is required' }),
  hospitalDescEn: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  hospitalDescNb: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  hospitalDescDa: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  hospitalDescSv: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  streetName: z.string().min(1, { message: 'Street name is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  streetNumber: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Street number is required',
  }),
  zipCode: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Zipcode is required',
  }),
  logo: z.instanceof(File, { message: 'A file is required' }),
  gallery: z
    .array(z.instanceof(File))
    .min(1, 'At least one image is required')
    .max(3, 'You can upload up to 3 images'),
});
export type CreateHospitalFormFields = z.infer<typeof createHospitalFormSchema>;
function HospitalDetailsPage({
  params,
}: {
  params: { id: string; procedureId: string };
}) {
  const hospitalProcedureId = useGetHospitalProcedureById({
    id: params.procedureId,
  });
  const [isCreateHospitalTeamModal, setIsCreateHospitalTeamModal] =
    useState<boolean>(false);
  const [isEditTeamMember, setIsEditTeamMember] = useState<boolean>(false);
  const [teamMemberId, setTeamMemberId] = useState<string>('');
  const [searchMemberQuery, setSearchMemberQuery] = useState<string>('');

  const router = useRouter();
  return (
    <div>
      <Header />

      <div className={style.hospitalDetailPageContainer}>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full border-none bg-rgba244"
        >
          <BackArrowIcon strokeWidth="2" stroke="rgba(17, 17, 17, 0.8)" />
        </button>

        {hospitalProcedureId.isLoading ? (
          <FacebookStyleLoader />
        ) : (
          <>
            <div className={style.headerSection}>
              <div className={style.titleContainer}>
                <div className={style.titleBreadCrumbContainer}>
                  {hospitalProcedureId.isSuccess &&
                    hospitalProcedureId.data.data && (
                      <h3 className="font-poppins text-[28px] font-medium text-neutral-1">
                        {hospitalProcedureId.data.data.procedure.name.en}
                      </h3>
                    )}

                  {hospitalProcedureId.isSuccess &&
                    hospitalProcedureId.data.data && (
                      <div className={style.breadcrumb}>
                        <Link href="/">
                          {
                            hospitalProcedureId.data.data.procedure.category
                              .name.en
                          }{' '}
                          department
                        </Link>
                        <span>/</span>
                        <Link href="/">Procedure details</Link>
                      </div>
                    )}
                </div>
              </div>

              <button
                className="flex cursor-pointer items-center gap-x-[10px] rounded-lg border-2 border-darkteal p-3"
                type="button"
                onClick={() =>
                  router.push(
                    `/hospitals/add/${params.id}/procedures/${params.procedureId}/edit`,
                  )
                }
              >
                <EditIcon className="size-5" stroke="rgba(9, 111, 144, 1)" />
                <p className="font-poppins text-sm font-semibold text-darkteal">
                  Edit Details
                </p>
              </button>
            </div>

            <h3 className="mb-7 font-poppins text-lg font-normal text-neutral-1">
              About the procedure
            </h3>
            {hospitalProcedureId.isSuccess && hospitalProcedureId.data.data && (
              <p className={style.hospitalDesc}>
                {hospitalProcedureId.data.data.description.en}
              </p>
            )}

            {hospitalProcedureId.isSuccess && hospitalProcedureId.data.data && (
              <div className="flex w-[520px] flex-wrap items-center gap-10">
                <div className="flex flex-col items-start justify-start">
                  <p className="font-lexend text-xl font-normal text-neutral-2">
                    Cost of procedure
                  </p>
                  <p className="font-lexend text-base font-light text-neutral-2">
                    {hospitalProcedureId.data.data.cost.en}
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <p className="font-lexend text-xl font-normal text-neutral-2">
                    Wait of procedure
                  </p>
                  <p className="font-lexend text-base font-light text-neutral-2">
                    {hospitalProcedureId.data.data.waitingTime}
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <p className="font-lexend text-xl font-normal text-neutral-2">
                    Duration of city stay
                  </p>
                  <p className="font-lexend text-base font-light text-neutral-2">
                    {hospitalProcedureId.data.data.stayInCity}
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <p className="font-lexend text-xl font-normal text-neutral-2">
                    Duration of hospital stay
                  </p>
                  <p className="font-lexend text-base font-light text-neutral-2">
                    {hospitalProcedureId.data.data.stayInHospital}
                  </p>
                </div>
                {hospitalProcedureId.data &&
                  hospitalProcedureId.data.data &&
                  hospitalProcedureId.data.data.hospitalProcedureImages &&
                  Array.isArray(
                    hospitalProcedureId.data.data.hospitalProcedureImages,
                  ) &&
                  hospitalProcedureId.data.data.hospitalProcedureImages.length >
                    0 && (
                    <div className="flex w-full flex-col items-start">
                      <h3 className="mb-7 font-poppins text-lg font-normal text-neutral-1">
                        Procedure related images
                      </h3>
                      <div className="flex w-full flex-row flex-wrap items-center gap-8">
                        {hospitalProcedureId.data.data.hospitalProcedureImages.map(
                          (file) => {
                            return (
                              <Image
                                key={file.id}
                                src={file.imageUrl}
                                width={220}
                                height={220}
                                alt="hospital-gallery"
                                className="size-[220px] rounded-lg"
                              />
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}

            <h3 className={style.subTitle} style={{ marginTop: '40px' }}>
              Team members
            </h3>
            {hospitalProcedureId.isSuccess && hospitalProcedureId.data.data && (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {hospitalProcedureId.data.data.hospitalMembers.length === 0 ? (
                  <div className={style.createTeamMemberContainer}>
                    <p className={style.title}>
                      No team members have been created yet!
                    </p>

                    <button
                      onClick={() => setIsCreateHospitalTeamModal(true)}
                      className={style.btn}
                      type="button"
                    >
                      <p>Create team members</p>
                    </button>
                  </div>
                ) : (
                  <div className={style.teamMemberViewSection}>
                    <div className="my-[32px] flex items-center justify-between">
                      <div className="relative">
                        <input
                          className="rounded-lg border border-neutral-4 px-4 py-[10px]"
                          type="text"
                          name="search-member"
                          id="search-member"
                          value={searchMemberQuery}
                          onChange={(e) => setSearchMemberQuery(e.target.value)}
                        />
                        <SearchIcon className="absolute right-4 top-4 size-4" />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          className="flex items-center justify-between rounded-[6.4px] bg-darkteal px-6 py-3 text-white"
                          type="button"
                          onClick={() => setIsCreateHospitalTeamModal(true)}
                        >
                          <Image src={plusIcon} alt="plus icon" />
                          <p className="ml-2 font-poppins text-base font-medium">
                            Add a team member
                          </p>
                        </button>

                        {isEditTeamMember ? (
                          <button
                            className="flex items-center justify-between rounded-[6.4px] border border-darkteal bg-primary-6 px-6 py-3 text-darkteal"
                            type="button"
                            onClick={() => setIsEditTeamMember(false)}
                          >
                            <Image src={editIcon} alt="edit icon" />
                            <p className="ml-2 font-poppins text-base font-medium">
                              Cancel editing
                            </p>
                          </button>
                        ) : (
                          <button
                            className="flex items-center justify-between rounded-[6.4px] border border-darkteal bg-primary-6 px-6 py-3 text-darkteal"
                            onClick={() => setIsEditTeamMember(true)}
                            type="button"
                          >
                            <Image src={editIcon} alt="edit icon" />
                            <p className="ml-2 font-poppins text-base font-medium">
                              Edit team members
                            </p>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={style.teamMemberCardsContainer}>
                      {searchMemberQuery
                        ? hospitalProcedureId.data.data.hospitalMembers
                            .filter((member) =>
                              member.name
                                .toLowerCase()
                                .includes(searchMemberQuery.toLowerCase()),
                            )
                            .map((member) => {
                              return (
                                <TeamMemberCard
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
                            })
                        : hospitalProcedureId.data.data.hospitalMembers.map(
                            (member) => {
                              return (
                                <TeamMemberCard
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
                            },
                          )}
                      {}
                    </div>
                  </div>
                )}
              </>
            )}
            <CreateHospitalTeamMemberModal
              isOpen={isCreateHospitalTeamModal}
              onClose={() => {
                setIsEditTeamMember(false);
                setTeamMemberId('');
                setIsCreateHospitalTeamModal(false);
              }}
              hospitalId={params.procedureId}
              memberId={teamMemberId}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default WithAuth(HospitalDetailsPage);
