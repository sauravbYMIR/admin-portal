/* eslint-disable react/button-has-type */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

import {
  CreateHospitalTeamMemberModal,
  FacebookStyleLoader,
  Header,
  TeamMemberCard,
  WithAuth,
} from '@/components';
import { useGetHospitalById } from '@/hooks';
import arrowForward from '@/public/assets/icons/arrowForward.svg';
import backArrow from '@/public/assets/icons/backArrow.svg';
import editIcon from '@/public/assets/icons/edit.svg';
import plusIcon from '@/public/assets/icons/plus.svg';
import hospitalLogo from '@/public/assets/icons/sampleLogo.svg';

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
  return (
    <div>
      <Header />

      {hospitalById.isLoading ? (
        <FacebookStyleLoader />
      ) : (
        <div className={style.hospitalDetailPageContainer}>
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => router.push('/hospitals')}
          >
            <Image src={backArrow} alt="back arrow icon" />
          </button>

          <div className={style.headerSection}>
            <div className={style.titleContainer}>
              {hospitalById &&
              hospitalById.data &&
              hospitalById.data.data &&
              typeof hospitalById.data.data.logo === 'string' ? (
                <Image
                  className={style.hospitalLogo}
                  src={hospitalById.data.data.logo}
                  alt="hospital logo"
                  width={100}
                  height={100}
                  unoptimized
                  priority
                />
              ) : (
                <Image
                  className={style.hospitalLogo}
                  src={hospitalLogo}
                  alt="hospital logo"
                />
              )}

              <div className={style.titleBreadCrumbContainer}>
                {hospitalById.isSuccess && hospitalById.data.data && (
                  <h3>{hospitalById.data.data.name}</h3>
                )}

                <div className={style.breadcrumb}>
                  <Link href="/">Hospitals</Link>
                  <span>/</span>
                  <Link href="/">Details</Link>
                </div>
              </div>
            </div>

            <button
              className={style.editHospitalBtn}
              type="button"
              onClick={() => router.push(`/hospitals/edit/${id}`)}
            >
              <Image width={24} height={24} src={editIcon} alt="edit icon" />
              <p>Edit Details</p>
            </button>
          </div>

          <h3 className={style.subTitle}>About the hospital</h3>
          {hospitalById.isSuccess && hospitalById.data.data && (
            <p className={style.hospitalDesc}>
              {hospitalById.data.data.description.en}
            </p>
          )}

          <h3 className={style.subTitle}>Address</h3>

          {hospitalById.isSuccess && hospitalById.data.data && (
            <p className={style.address}>
              {hospitalById.data.data.streetNumber}{' '}
              {hospitalById.data.data.streetName}, {hospitalById.data.data.city}
              , {hospitalById.data.data.country}
            </p>
          )}

          <h3 className={style.subTitle}>Hospital gallery</h3>

          {hospitalById.isSuccess &&
          hospitalById.data.data &&
          Array.isArray(hospitalById.data.data.hospitalImages) &&
          hospitalById.data.data.hospitalImages.length > 0 ? (
            <div className="mb-12 mt-7 flex w-full flex-wrap items-center gap-4">
              {hospitalById.data.data.hospitalImages.map((file) => {
                return (
                  <Image
                    key={file.id}
                    src={file.imageUrl}
                    width={64}
                    height={64}
                    alt="hospital-gallery"
                    className="h-[250px] w-[264px] rounded-lg"
                  />
                );
              })}
            </div>
          ) : (
            <p className={`${style.title} mb-12`}>No images uploaded</p>
          )}

          <h3 className={style.subTitle}>Team members</h3>

          {hospitalById.isSuccess && hospitalById.data.data && (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {hospitalById.data.data.members.length === 0 ? (
                <div className={style.createTeamMemberContainer}>
                  <p className={style.title}>
                    No team members have been created yet!
                  </p>

                  <button
                    onClick={() => setIsCreateHospitalTeamModal(true)}
                    className={style.btn}
                  >
                    <p>Create team members</p>
                  </button>
                </div>
              ) : (
                <div className={style.teamMemberViewSection}>
                  <div className={style.headerSection}>
                    <button
                      className={style.addBtn}
                      onClick={() => setIsCreateHospitalTeamModal(true)}
                    >
                      <Image src={plusIcon} alt="plus icon" />
                      <p>Add a team member</p>
                    </button>

                    {isEditTeamMember ? (
                      <button
                        className={style.editBtn}
                        onClick={() => setIsEditTeamMember(false)}
                      >
                        <Image src={editIcon} alt="edit icon" />
                        <p>Cancel editing</p>
                      </button>
                    ) : (
                      <button
                        className={style.editBtn}
                        onClick={() => setIsEditTeamMember(true)}
                      >
                        <Image src={editIcon} alt="edit icon" />
                        <p>Edit team members</p>
                      </button>
                    )}
                  </div>

                  <div className={style.teamMemberCardsContainer}>
                    {hospitalById.data.data.members.map((member) => {
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
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          <h3 className={style.subTitle}>Procedures</h3>

          <div className={style.procedureManagementContainer}>
            <h2>Procedure management</h2>

            <button
              onClick={() =>
                router.push(`/hospitals/add/${hospitalId}/procedures`)
              }
              className={style.linkBtn}
              type="button"
            >
              <p>View all</p>
              <Image src={arrowForward} alt="arrow forward icon" />
            </button>
          </div>

          <CreateHospitalTeamMemberModal
            isOpen={isCreateHospitalTeamModal}
            onClose={() => {
              setIsEditTeamMember(false);
              setTeamMemberId('');
              setIsCreateHospitalTeamModal(false);
            }}
            hospitalId={id}
            memberId={teamMemberId}
          />
        </div>
      )}
    </div>
  );
}

export default WithAuth(HospitalDetailsPage);
