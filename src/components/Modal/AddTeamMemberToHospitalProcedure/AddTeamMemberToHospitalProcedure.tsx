/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { z } from 'zod';

import procedureModalStyle from '@/components/Modal/ProcedureModal/procedureModal.module.scss';
import { useGetHospitalTeamMembersByHospitalId } from '@/hooks';
import type { NameJSONType } from '@/hooks/useDepartment';
import closeIcon from '@/public/assets/icons/close.svg';
import type { LanguagesType } from '@/types/components';
import { countryData } from '@/utils/global';

import modalStyle from '../CreateHospitalTeamMemberModal/style.module.scss';

const roleObj = {
  English: 'roleEn',
  Norwegian: 'roleNb',
  Danish: 'roleDa',
  Swedish: 'roleSv',
};
export const teamMemberTypeSchema = z.object({
  label: z.string(),
  value: z.string().min(1, { message: 'Please select member to proceed' }),
});
export type HospitalTeamMemberSchemaType =
  | 'roleEn'
  | 'roleNb'
  | 'roleDa'
  | 'roleSv';
const addTeamMemberFormSchema = z.object({
  teamMemberId: teamMemberTypeSchema,
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
});
export type CreateHospitalTeamMemberFormFields = z.infer<
  typeof addTeamMemberFormSchema
>;

export function AddTeamMemberToHospitalProcedure({
  isOpen,
  hospitalId,
  onClose,
  setTeamMembers,
  teamMembers,
}: {
  isOpen: boolean;
  onClose: () => void;
  hospitalId: string;
  setTeamMembers: React.Dispatch<
    React.SetStateAction<
      Array<{
        member: {
          id: string;
          name: string;
        };
        role: NameJSONType;
      }>
    >
  >;
  teamMembers: Array<{
    role: NameJSONType;
    member: {
      id: string;
      name: string;
    };
  }>;
}) {
  const [addAnotherTeamMember, setAddAnotherTeamMember] =
    React.useState<boolean>(false);
  const hospitalTeamMembers = useGetHospitalTeamMembersByHospitalId({
    id: hospitalId,
  });
  const [teamMemberList, setTeamMemberList] = React.useState<
    Array<{
      label: string;
      value: string;
    }>
  >([]);
  React.useEffect(() => {
    if (
      hospitalTeamMembers.isSuccess &&
      hospitalTeamMembers.data &&
      Array.isArray(hospitalTeamMembers.data.data) &&
      hospitalTeamMembers.data.data.length > 0
    ) {
      setTeamMemberList(() =>
        hospitalTeamMembers.data.data.map((teamMember) => ({
          value: teamMember.id,
          label: teamMember.name,
        })),
      );
    }
  }, [hospitalTeamMembers.data, hospitalTeamMembers.isSuccess]);
  const [selectedOption, setSelectedOption] = React.useState<{
    label: string;
    value: string;
  } | null>(null);
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateHospitalTeamMemberFormFields>({
    resolver: zodResolver(addTeamMemberFormSchema),
  });
  const shouldRenderError = countryData.some((c) => {
    const lang = roleObj[c.language] as HospitalTeamMemberSchemaType;
    return errors[lang] && errors[lang]?.message;
  });
  const onFormSubmit: SubmitHandler<CreateHospitalTeamMemberFormFields> = (
    data: CreateHospitalTeamMemberFormFields,
  ) => {
    if (
      teamMembers.find(
        (member) => member.member.id === data.teamMemberId.value,
      ) !== undefined
    ) {
      return;
    }
    setTeamMembers((prevState) => [
      ...prevState,
      {
        member: {
          id: data.teamMemberId.value,
          name: data.teamMemberId.label,
        },
        role: {
          en: data.roleEn,
          nb: data.roleNb,
          da: data.roleDa,
          sv: data.roleSv,
        },
      },
    ]);
    if (!addAnotherTeamMember) {
      onClose();
    }
  };
  return (
    <div>
      {isOpen && (
        <div className={modalStyle.modalOverlay}>
          <div className={modalStyle.modal}>
            <div className={modalStyle.modalHeader}>
              <h2 className={modalStyle.title}>Add a team member</h2>

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
                  Role
                </label>

                <div className={modalStyle.languageTabContainer}>
                  {countryData.map((data) => {
                    const lang = roleObj[
                      data.language
                    ] as HospitalTeamMemberSchemaType;
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
                  const lang = roleObj[
                    c.language
                  ] as HospitalTeamMemberSchemaType;
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
              <label
                style={{
                  marginBottom: '8px',
                  display: 'block',
                  textAlign: 'start',
                }}
                className={modalStyle.label}
                htmlFor="teamMemberId"
              >
                Team member
              </label>
              <Controller
                name="teamMemberId"
                control={control}
                defaultValue={
                  selectedOption?.label
                    ? selectedOption
                    : { label: '', value: '' }
                }
                render={({ field }) => (
                  <Select
                    {...field}
                    options={teamMemberList}
                    onChange={(value) => {
                      setSelectedOption(value);
                      field.onChange(value);
                    }}
                  />
                )}
              />
              {errors.teamMemberId && (
                <div className="mt-1 text-start font-lexend text-base font-normal text-error">
                  {errors.teamMemberId.message}
                </div>
              )}
              <div
                className={`${procedureModalStyle.procedureCheckboxContainer} mt-16`}
              >
                <input
                  onChange={() =>
                    setAddAnotherTeamMember((prevState) => !prevState)
                  }
                  checked={addAnotherTeamMember}
                  className={procedureModalStyle.checkbox}
                  type="checkbox"
                  id="add-member-radio"
                />
                <label
                  className={procedureModalStyle.checkboxLabel}
                  htmlFor="add-member-radio"
                  style={{ marginLeft: '24px' }}
                >
                  Add another member
                </label>
              </div>
              <button
                className={modalStyle.createMemberBtn}
                style={{ marginTop: '24px' }}
                type="submit"
              >
                <p>Add member</p>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
