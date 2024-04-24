/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { FbtButton } from '@frontbase/components-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { z } from 'zod';

import {
  CreateHospitalTeamMemberModal,
  Header,
  TeamMemberCard,
  WithAuth,
} from '@/components';
import { useGetHospitalProcedureById } from '@/hooks/useHospitalProcedure';
import backArrow from '@/public/assets/icons/backArrow.svg';
import editIcon from '@/public/assets/icons/edit.svg';
import plusIcon from '@/public/assets/icons/plus.svg';
import hospitalLogo from '@/public/assets/icons/sampleLogo.svg';

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
  logo: z.custom<File>((v) => v instanceof File, {
    message: 'Image is required',
  }),
  gallery: z.custom<File>((v) => v instanceof File, {
    message: 'Image is required',
  }),
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
              {hospitalProcedureId.isSuccess &&
                hospitalProcedureId.data.data && (
                  <h3>{hospitalProcedureId.data.data.procedure.name.en}</h3>
                )}

              {hospitalProcedureId.isSuccess &&
                hospitalProcedureId.data.data && (
                  <div className={style.breadcrumb}>
                    <Link href="/">
                      {hospitalProcedureId.data.data.procedure.category.name.en}{' '}
                      department
                    </Link>
                    <span>/</span>
                    <Link href="/">Procedure details</Link>
                  </div>
                )}
            </div>
          </div>

          <FbtButton
            className={style.editHospitalBtn}
            size="sm"
            variant="outline"
            onClick={() => router.push(`/hospitals/edit/${params.procedureId}`)}
          >
            <Image width={24} height={24} src={editIcon} alt="edit icon" />
            <p>Edit Details</p>
          </FbtButton>
        </div>

        <h3 className={style.subTitle}>About the procedure</h3>
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
          </div>
        )}

        <h3 className={style.subTitle} style={{ marginTop: '40px' }}>
          Procedure members
        </h3>
        {hospitalProcedureId.isSuccess && hospitalProcedureId.data.data && (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {hospitalProcedureId.data.data.hospitalMembers.length === 0 ? (
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
                  <input
                    className="rounded-lg border border-neutral-4 px-4 py-[10px]"
                    type="text"
                    name=""
                    id=""
                  />
                  <div className="flex items-center justify-between">
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
                </div>

                <div className={style.teamMemberCardsContainer}>
                  {hospitalProcedureId.data.data.hospitalMembers.map(
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
                        />
                      );
                    },
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <CreateHospitalTeamMemberModal
          isOpen={isCreateHospitalTeamModal}
          onClose={() => {
            setTeamMemberId('');
            setIsCreateHospitalTeamModal(false);
          }}
          hospitalId={params.procedureId}
          memberId={teamMemberId}
        />
      </div>
    </div>
  );
}

export default WithAuth(HospitalDetailsPage);
