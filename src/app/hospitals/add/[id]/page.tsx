'use client';

import { FbtButton } from '@frontbase/components-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

import {
  CreateHospitalTeamMemberModal,
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

      <div className={style.hospitalDetailPageContainer}>
        <Image src={backArrow} alt="back arrow icon" />

        <div className={style.headerSection}>
          <div className={style.titleContainer}>
            <Image
              className={style.hospitalLogo}
              src={hospitalLogo}
              alt="hospital logo"
            />

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

          <FbtButton
            className={style.editHospitalBtn}
            size="sm"
            variant="outline"
            onClick={() => router.push(`/hospitals/edit/${id}`)}
          >
            <Image width={24} height={24} src={editIcon} alt="edit icon" />
            <p>Edit Details</p>
          </FbtButton>
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
            {hospitalById.data.data.streetName}, {hospitalById.data.data.city},{' '}
            {hospitalById.data.data.country}
          </p>
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

                <FbtButton
                  onClick={() => setIsCreateHospitalTeamModal(true)}
                  className={style.btn}
                  variant="solid"
                  size="sm"
                >
                  <p>Create team members</p>
                </FbtButton>
              </div>
            ) : (
              <div className={style.teamMemberViewSection}>
                <div className={style.headerSection}>
                  <FbtButton
                    className={style.addBtn}
                    size="sm"
                    variant="solid"
                    onClick={() => setIsCreateHospitalTeamModal(true)}
                  >
                    <Image src={plusIcon} alt="plus icon" />
                    <p>Add a team member</p>
                  </FbtButton>

                  <FbtButton
                    className={style.editBtn}
                    size="sm"
                    variant="solid"
                    onClick={() => setIsEditTeamMember(true)}
                  >
                    <Image src={editIcon} alt="edit icon" />
                    <p>Edit team members</p>
                  </FbtButton>
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
            setTeamMemberId('');
            setIsCreateHospitalTeamModal(false);
          }}
          hospitalId={id}
          memberId={teamMemberId}
        />
      </div>
    </div>
  );
}

export default WithAuth(HospitalDetailsPage);
