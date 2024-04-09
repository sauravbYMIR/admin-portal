'use client';

import { FbtButton } from '@frontbase/components-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';

import {
  CreateHospitalTeamMemberModal,
  Header,
  TeamMemberCard,
  WithAuth,
} from '@/components';
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

function HospitalDetailsPage() {
  const [isCreateHospitalTeamModal, setIsCreateHospitalTeamModal] =
    useState(false);

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
              <h3>Avanti hospital</h3>

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
          >
            <Image width={24} height={24} src={editIcon} alt="edit icon" />
            <p>Edit Details</p>
          </FbtButton>
        </div>

        <h3 className={style.subTitle}>About the hospital</h3>
        <p className={style.hospitalDesc}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniammodo Lorem ipsum dolor sit amet, consectetur adipiscing
          elit, sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua. Ut enim ad minim veniammodo Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua. Ut enim ad minim veniammodo{' '}
        </p>

        <h3 className={style.subTitle}>Address</h3>

        <p className={style.address}>23 St Olavs street, Oslo, Norway, 2445</p>

        <h3 className={style.subTitle}>Team members</h3>

        <div className={style.createTeamMemberContainer}>
          <p className={style.title}>No team members have been created yet!</p>

          <FbtButton
            onClick={() => setIsCreateHospitalTeamModal(true)}
            className={style.btn}
            variant="solid"
            size="sm"
          >
            <p>Create team members</p>
          </FbtButton>
        </div>

        <div className={style.teamMemberViewSection}>
          <div className={style.headerSection}>
            <FbtButton className={style.addBtn} size="sm" variant="solid">
              <Image src={plusIcon} alt="plus icon" />
              <p>Add a team member</p>
            </FbtButton>

            <FbtButton className={style.editBtn} size="sm" variant="solid">
              <Image src={editIcon} alt="edit icon" />
              <p>Edit team members</p>
            </FbtButton>
          </div>

          <div className={style.teamMemberCardsContainer}>
            {[...Array(8)].map((_, index) => {
              // eslint-disable-next-line react/no-array-index-key
              return <TeamMemberCard key={index} />;
            })}
          </div>
        </div>

        <h3 className={style.subTitle}>Procedures</h3>

        <div className={style.procedureManagementContainer}>
          <h2>Procedure management</h2>

          <button
            onClick={() => router.push(`/hospitals/add/467/procedures`)}
            className={style.linkBtn}
            type="button"
          >
            <p>View all</p>
            <Image src={arrowForward} alt="arrow forward icon" />
          </button>
        </div>

        <CreateHospitalTeamMemberModal
          isOpen={isCreateHospitalTeamModal}
          onClose={() => setIsCreateHospitalTeamModal(false)}
        />
      </div>
    </div>
  );
}

export default WithAuth(HospitalDetailsPage);
