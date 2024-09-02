/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { z } from 'zod';

import { CloseIcon } from '@/components/Icons/Icons';
import departmentModalStyle from '@/components/Modal/DepartmentModal/departmentModal.module.scss';
import { useGetHospitalTeamMembersByHospitalId } from '@/hooks';
import type { NameJSONType } from '@/hooks/useDepartment';
import type { LanguagesType } from '@/types/components';
import { countryData, roleObj, RoleSchema } from '@/utils/global';

import modalStyle from '../CreateHospitalTeamMemberModal/style.module.scss';
import type { Locale } from '../DepartmentModal/DepartmentModal';

export const teamMemberTypeSchema = z.object({
  label: z.string(),
  value: z.string().min(1, { message: 'Please select member to proceed' }),
});

export type RoleFormSchemaType = `role${Capitalize<Locale>}`;

const addTeamMemberFormSchema = z.object({
  teamMemberId: teamMemberTypeSchema,
  ...RoleSchema,
});

type FormErrors = {
  [key in RoleFormSchemaType]?: { message?: string };
} & {
  teamMemberId?: { message?: string };
};
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
      name: string;
      role: NameJSONType;
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
        hospitalTeamMembers.data.data
          .filter(
            (teamMember) =>
              !teamMembers.find(({ member: { id } }) => id === teamMember.id),
          )
          .map((teamMember) => ({
            value: teamMember.id,
            name: `${teamMember.name}`,
            label: `${teamMember.name} - ${teamMember.position.en} - ${teamMember.qualification?.en}`,
            role: teamMember.position,
          })),
      );
    }
  }, [hospitalTeamMembers.data, hospitalTeamMembers.isSuccess, teamMembers]);
  const [selectedOption, setSelectedOption] = React.useState<{
    label: string;
    value: string;
    name: string;
  } | null>(null);
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<CreateHospitalTeamMemberFormFields>({
    resolver: zodResolver(addTeamMemberFormSchema),
  });
  const shouldRenderError = countryData.some((c) => {
    const lang = roleObj[c.language] as RoleFormSchemaType;
    return (
      (errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message
    );
  });
  const onFormSubmit: SubmitHandler<CreateHospitalTeamMemberFormFields> = (
    data: CreateHospitalTeamMemberFormFields,
  ) => {
    // if (
    //   teamMembers.find(
    //     (member) => member.member.id === data.teamMemberId.value,
    //   ) !== undefined
    // ) {
    //   return;
    // }
    const roleDataObj = Object.keys(data).reduce(
      (acc, curr) => {
        const value =
          curr.split('role').length > 0
            ? curr.split('role')[1]?.toLowerCase()
            : '';
        if (value) {
          // @ts-ignore
          acc[value] = data[curr as keyof CreateHospitalTeamMemberFormFields];
        }
        return acc;
      },
      {} as Record<RoleFormSchemaType, string>,
    );
    setTeamMembers((prevState) => [
      ...prevState,
      {
        member: {
          id: data.teamMemberId.value,
          name: data.teamMemberId.label,
        },
        role: {
          ...roleDataObj,
        },
      },
    ]);
    reset();
    setSelectedOption({
      label: '',
      value: '',
      name: '',
    });
    if (!addAnotherTeamMember) {
      onClose();
    }
  };
  return (
    <div>
      {isOpen && (
        <div className={modalStyle.modalOverlayDup}>
          <div className={modalStyle.modalDup}>
            <div className="mb-14 flex items-start justify-between">
              <h2 className="font-poppins text-lg font-semibold text-neutral-1">
                Add a team member
              </h2>
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => {
                  reset();
                  setSelectedOption({
                    label: '',
                    value: '',
                    name: '',
                  });
                  setAddAnotherTeamMember(false);
                  onClose();
                }}
              >
                <p className="hidden">text</p>
                <CloseIcon className="mb-2 size-6" strokeWidth={1.7} />
              </button>
            </div>

            <form
              className={modalStyle.modalBodyDup}
              onSubmit={handleSubmit(onFormSubmit)}
            >
              <div className="mb-10 flex w-full flex-col items-start">
                <div className="flex flex-col items-start gap-y-2">
                  <label
                    className="font-poppins text-base font-normal text-neutral-2"
                    htmlFor="teamMemberId"
                  >
                    Team member
                  </label>
                  {selectedOption && (
                    <small className="text-sm font-normal italic">
                      {selectedOption.name}
                    </small>
                  )}
                </div>
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
                      className="mt-3 w-full"
                      options={teamMemberList}
                      onChange={(value) => {
                        if (value) {
                          const v = value as {
                            name: string;
                            value: string;
                            label: string;
                            role: NameJSONType;
                          };
                          Object.values(roleObj).forEach((d: string) => {
                            const locale = d.split('role')[1]?.toLowerCase();
                            if (locale) {
                              const val = v.role[locale];
                              if (val) {
                                // @ts-ignore
                                setValue(d, val);
                              }
                            }
                          });

                          setSelectedOption({
                            label: v.name,
                            value: v.value,
                            name: v.label,
                          });
                          field.onChange({
                            label: v.name,
                            value: v.value,
                          });
                        }
                      }}
                    />
                  )}
                />
                {errors.teamMemberId && errors.teamMemberId?.value && (
                  <div className="mt-1 text-start font-lexend text-base font-normal text-error">
                    {errors.teamMemberId?.value.message}
                  </div>
                )}
              </div>
              <div className="flex w-full flex-col items-start">
                <label
                  className="font-poppins text-base font-normal text-neutral-2"
                  htmlFor="position"
                >
                  Role
                </label>

                <div className={modalStyle.languageTabContainer}>
                  {countryData.map((data) => {
                    const lang = roleObj[data.language] as RoleFormSchemaType;
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
                  const lang = roleObj[c.language] as RoleFormSchemaType;
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

              <div style={{ marginTop: '64px', marginBottom: '28px' }}>
                <label
                  className={departmentModalStyle.checkboxLabel}
                  htmlFor="add-member-radio"
                >
                  <span className="absolute top-[-2px]">
                    Add another member
                  </span>
                  <input
                    className={departmentModalStyle.checkboxStyle}
                    type="checkbox"
                    checked={addAnotherTeamMember}
                    id="add-member-radio"
                    onChange={() =>
                      setAddAnotherTeamMember((prevState) => !prevState)
                    }
                  />
                  <span className={departmentModalStyle.checkmark} />
                </label>
              </div>
              <button
                className="flex w-[280px] cursor-pointer items-center justify-center rounded-lg bg-darkteal px-4 py-[15px]"
                style={{ marginTop: '24px' }}
                type="submit"
              >
                <p className="font-poppins text-sm font-bold text-white">
                  Add member
                </p>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
