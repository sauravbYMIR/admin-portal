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
  EditIcon,
  FacebookStyleLoader,
  Header,
  PlusIcon,
  SearchIcon,
  WithAuth,
} from '@/components';
import HospitalTeamMemberCard from '@/components/Card/HospitalTeamMemberCard/HospitalTeamMemberCard';
import { AddTeamMemberAPI } from '@/components/Modal/AddTeamMemberAPI/AddTeamMemberAPI';
import type { NameJSONType } from '@/hooks/useDepartment';
import { useGetHospitalProcedureById } from '@/hooks/useHospitalProcedure';
import emptyTeamMember from '@/public/assets/images/emptyTeamMember.svg';
import { convertToValidCurrency, countryData } from '@/utils/global';

import style from '../../hospitalDetailPage.module.scss';

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
    .min(3, 'At least 3 image is required')
    .max(10, 'You can upload up to 10 images'),
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
  const [searchMemberQuery, setSearchMemberQuery] = useState<string>('');
  const [selectedTeamMemberDetails, setSelectedTeamMemberDetails] = useState<{
    role: NameJSONType | null;
    id: string;
    position: NameJSONType;
    name: string;
    qualification: NameJSONType;
  }>({
    role: { en: '', nb: '', da: '', sv: '' },
    position: { en: '', nb: '', da: '', sv: '' },
    id: '',
    name: '',
    qualification: {
      en: '',
      nb: '',
      da: '',
      sv: '',
    },
  });

  const router = useRouter();
  return (
    <div>
      <Header />

      <div className={style.hospitalDetailPageContainer}>
        <button
          type="button"
          onClick={() => router.push(`/hospitals/add/${params.id}/procedures`)}
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
                        <Link href={`/hospitals/add/${params.id}/procedures`}>
                          <span className="font-lexend text-base font-normal text-neutral-3">
                            Procedure list
                          </span>
                        </Link>
                        <span>/</span>
                        <Link
                          href={`/hospitals/add/${params.id}/procedures/${params.procedureId}`}
                        >
                          <span className="font-lexend text-base font-normal text-darkteal">
                            Procedure details
                          </span>
                        </Link>
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

            <h3 className="mb-4 font-poppins text-lg font-medium text-neutral-1">
              About the procedure
            </h3>
            {hospitalProcedureId.isSuccess && hospitalProcedureId.data.data && (
              <p className="mb-12 font-lexend text-base font-light text-neutral-3">
                {hospitalProcedureId.data.data.description.en}
              </p>
            )}

            {hospitalProcedureId.isSuccess && hospitalProcedureId.data.data && (
              <div className="grid w-[520px] grid-cols-2 gap-x-20 gap-y-10">
                <div className="flex flex-col items-start justify-start">
                  <p className="font-lexend text-lg font-normal text-neutral-2">
                    Cost of procedure
                  </p>
                  {hospitalProcedureId.data.data.cost.price && (
                    <p className="font-lexend text-base font-light text-neutral-2">
                      {convertToValidCurrency({
                        price: hospitalProcedureId.data.data.cost.price,
                        currency: hospitalProcedureId.data.data.cost.currency,
                        locale:
                          countryData.find(
                            (d) =>
                              d.currency ===
                              hospitalProcedureId.data.data.cost.currency,
                          )?.locale ?? 'en',
                      })}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-start justify-start">
                  <p className="font-lexend text-lg font-normal text-neutral-2">
                    Wait of procedure
                  </p>
                  <p className="font-lexend text-base font-light text-neutral-2">
                    {hospitalProcedureId.data.data.waitingTime}
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start">
                  <p className="font-lexend text-lg font-normal text-neutral-2">
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
              </div>
            )}

            {hospitalProcedureId.isSuccess &&
              hospitalProcedureId.data.data &&
              hospitalProcedureId.data &&
              hospitalProcedureId.data.data &&
              hospitalProcedureId.data.data.hospitalProcedureImages &&
              Array.isArray(
                hospitalProcedureId.data.data.hospitalProcedureImages,
              ) &&
              hospitalProcedureId.data.data.hospitalProcedureImages.length >
                0 && (
                <div className="mt-12 flex w-full flex-col items-start">
                  <h3 className="mb-7 font-poppins text-lg font-normal text-neutral-1">
                    Procedure related images
                  </h3>
                  <div className="flex w-full flex-row flex-wrap items-center gap-8">
                    {hospitalProcedureId.data.data.hospitalProcedureImages.map(
                      (file) => {
                        return (
                          <Image
                            key={file.id}
                            src={`${file.imageUrl}?version=${new Date().getTime()}`}
                            width={220}
                            height={220}
                            priority
                            unoptimized
                            alt="hospital-gallery"
                            className="aspect-square size-[220px] rounded-lg border border-stone-400 object-cover"
                          />
                        );
                      },
                    )}
                  </div>
                </div>
              )}

            <h3 className={style.subTitle} style={{ marginTop: '40px' }}>
              Team members
            </h3>
            {hospitalProcedureId.isSuccess && hospitalProcedureId.data.data && (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {hospitalProcedureId.data.data.procedureMembers.length === 0 ? (
                  <div className="mb-12 flex w-full flex-col items-start">
                    <h3 className="my-8 font-poppins text-lg font-medium text-neutral-1">
                      Team members
                    </h3>
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
                          Add team members
                        </p>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={style.teamMemberViewSection}>
                    <div className="my-[32px] flex items-center justify-between">
                      <div className="relative">
                        <input
                          placeholder="Search team members"
                          className="w-[246px] rounded-lg border border-neutral-4 px-4 py-[10px]"
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
                          onClick={() => {
                            setIsCreateHospitalTeamModal(true);
                            setIsEditTeamMember(false);
                          }}
                        >
                          <PlusIcon className="size-5" stroke="#fff" />
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
                            <EditIcon
                              className="size-5"
                              stroke="rgba(9, 111, 144, 1)"
                            />
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
                            <EditIcon
                              className="size-5"
                              stroke="rgba(9, 111, 144, 1)"
                            />
                            <p className="ml-2 font-poppins text-base font-medium">
                              Edit team members
                            </p>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mb-16 flex flex-wrap items-center gap-8">
                      {searchMemberQuery
                        ? hospitalProcedureId.data.data.procedureMembers
                            .filter((member) =>
                              member.name
                                .toLowerCase()
                                .includes(searchMemberQuery.toLowerCase()),
                            )
                            .map((member) => {
                              return (
                                <HospitalTeamMemberCard
                                  hospitalProcedureId={params.procedureId}
                                  teamMemberId={member.id}
                                  name={member.name}
                                  qualification={member.qualification}
                                  role={
                                    member.role ? member.role.en ?? '' : '---'
                                  }
                                  key={member.id}
                                  isEdit={isEditTeamMember}
                                  onOpen={() => {
                                    // setTeamMemberId(member.id);
                                    setIsCreateHospitalTeamModal(true);
                                    setSelectedTeamMemberDetails({
                                      role: member.role,
                                      position: member.position,
                                      id: member.id,
                                      name: member.name,
                                      qualification: member.qualification,
                                    });
                                  }}
                                  profile={
                                    member.profilePictureUploaded
                                      ? member.profile
                                      : false
                                  }
                                />
                              );
                            })
                        : hospitalProcedureId.data.data.procedureMembers.map(
                            (member) => {
                              return (
                                <HospitalTeamMemberCard
                                  hospitalProcedureId={params.procedureId}
                                  teamMemberId={member.id}
                                  name={member.name}
                                  qualification={member.qualification}
                                  role={
                                    member.role ? member.role.en ?? '' : '---'
                                  }
                                  key={member.id}
                                  isEdit={isEditTeamMember}
                                  onOpen={() => {
                                    // setTeamMemberId(member.id);
                                    setIsCreateHospitalTeamModal(true);
                                    setSelectedTeamMemberDetails({
                                      role: member.role,
                                      position: member.position,
                                      id: member.id,
                                      name: member.name,
                                      qualification: member.qualification,
                                    });
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
            <AddTeamMemberAPI
              hospitalId={params.id}
              isEditTeamMember={isEditTeamMember}
              hospitalProcedureId={params.procedureId}
              isOpen={isCreateHospitalTeamModal}
              onClose={() => {
                setSelectedTeamMemberDetails({
                  role: {
                    en: '',
                    nb: '',
                    da: '',
                    sv: '',
                  },
                  position: {
                    en: '',
                    nb: '',
                    da: '',
                    sv: '',
                  },
                  id: '',
                  name: '',
                  qualification: {
                    en: '',
                    nb: '',
                    da: '',
                    sv: '',
                  },
                });
                setIsEditTeamMember(false);
                setIsCreateHospitalTeamModal(false);
              }}
              selectedTeamMemberDetails={selectedTeamMemberDetails}
              procedureMembers={
                hospitalProcedureId.data?.success
                  ? hospitalProcedureId.data?.data.procedureMembers.map(
                      (member) => member.id,
                    )
                  : []
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

export default WithAuth(HospitalDetailsPage);
