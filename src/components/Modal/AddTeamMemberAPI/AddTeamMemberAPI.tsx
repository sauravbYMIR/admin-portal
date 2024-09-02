/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
import { z } from 'zod';

import { CloseIcon } from '@/components/Icons/Icons';
import departmentModalStyle from '@/components/Modal/DepartmentModal/departmentModal.module.scss';
import { useGetHospitalTeamMembersByHospitalId } from '@/hooks';
import type { NameJSONType } from '@/hooks/useDepartment';
import {
  useAddHospitalMemberToProcedure,
  useEditHospitalProcedureMember,
} from '@/hooks/useHospitalProcedure';
import type { LanguagesType } from '@/types/components';
import { countryData } from '@/utils/global';

import modalStyle from '../CreateHospitalTeamMemberModal/style.module.scss';
import type { Locale } from '../DepartmentModal/DepartmentModal';

export const teamMemberTypeSchema = z.object({
  label: z.string().min(1, { message: 'Please select member to proceed' }),
  value: z.string().min(1, { message: 'Please select member to proceed' }),
});

export type HospitalTeamMemberSchemaType = `role${Capitalize<Locale>}`;
type FormErrors = {
  [key in HospitalTeamMemberSchemaType]?: { message?: string };
} & {
  teamMemberId?: { message?: string };
};
const RoleSchema = countryData.reduce(
  (acc, currValue) => {
    const schema =
      `role${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}` as HospitalTeamMemberSchemaType;
    acc[schema] = z
      .string()
      .min(1, { message: 'Fill in details in all the languages' });
    return acc;
  },
  {} as Record<HospitalTeamMemberSchemaType, z.ZodString>,
);
const roleObj = countryData.reduce(
  (acc, currValue) => {
    const name = `role${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}`;
    acc[currValue.language] = name;
    return acc;
  },
  {} as Record<string, string>,
);
const addTeamMemberFormSchema = z.object({
  teamMemberId: teamMemberTypeSchema,
  ...RoleSchema,
});
export type EditHospitalTeamMemberFormFields = z.infer<
  typeof addTeamMemberFormSchema
>;

export function AddTeamMemberAPI({
  isOpen,
  hospitalId,
  hospitalProcedureId,
  onClose,
  selectedTeamMemberDetails,
  procedureMembers,
  isEditTeamMember,
}: {
  isEditTeamMember: boolean;
  isOpen: boolean;
  hospitalProcedureId: string;
  onClose: () => void;
  hospitalId: string;
  selectedTeamMemberDetails: {
    role: NameJSONType | null;
    id: string;
    position: NameJSONType;
    name: string;
    qualification: NameJSONType;
  };
  procedureMembers: Array<string>;
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
          .filter((member) => !procedureMembers.find((id) => id === member.id))
          .map((teamMember) => ({
            value: teamMember.id,
            name: `${teamMember.name}`,
            label: `${teamMember.name} - ${teamMember.position.en} - ${teamMember.qualification?.en}`,
            role: teamMember.position,
          })),
      );
    }
  }, [
    hospitalTeamMembers.data,
    hospitalTeamMembers.isSuccess,
    procedureMembers,
  ]);
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
  } = useForm<EditHospitalTeamMemberFormFields>({
    resolver: zodResolver(addTeamMemberFormSchema),
  });
  const shouldRenderError = countryData.some((c) => {
    const lang = roleObj[c.language] as HospitalTeamMemberSchemaType;
    return (
      (errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message
    );
  });
  const addHospitalMemberToProcedure = useAddHospitalMemberToProcedure({
    hospitalProcedureId,
    onClose: addAnotherTeamMember ? null : onClose,
  });
  const editHospitalProcedureMember = useEditHospitalProcedureMember({
    hospitalProcedureId,
    onClose,
  });
  const onFormSubmit: SubmitHandler<EditHospitalTeamMemberFormFields> = (
    data: EditHospitalTeamMemberFormFields,
  ) => {
    if (!hospitalProcedureId) {
      toast.error('Invalid hospital procedure, refresh the page and try again');
      return;
    }
    const roleDataObj = Object.keys(data).reduce(
      (acc, curr) => {
        const value =
          curr.split('role').length > 0
            ? curr.split('role')[1]?.toLowerCase()
            : '';
        if (value) {
          // @ts-ignore
          acc[value] = data[curr] as string;
        }
        return acc;
      },
      {} as Record<HospitalTeamMemberSchemaType, string>,
    );
    if (isEditTeamMember) {
      editHospitalProcedureMember.mutate({
        role: {
          ...roleDataObj,
        },
        memberId: data.teamMemberId.value,
        hospitalProcedure: hospitalProcedureId,
      });
      return;
    }
    addHospitalMemberToProcedure.mutate({
      role: {
        ...roleDataObj,
      },
      hospitalProcedure: hospitalProcedureId,
      memberId: data.teamMemberId.value,
    });

    reset();
    setSelectedOption({
      label: '',
      value: '',
      name: '',
    });
  };
  React.useEffect(() => {
    if (
      isEditTeamMember &&
      selectedTeamMemberDetails.id &&
      selectedTeamMemberDetails.role
    ) {
      Object.values(roleObj).forEach((d) => {
        const locale = d.split('role')[1]?.toLowerCase();
        if (
          locale &&
          selectedTeamMemberDetails &&
          selectedTeamMemberDetails.role
        ) {
          const val = selectedTeamMemberDetails.role[locale];
          if (val) {
            // @ts-ignore
            setValue(d, val);
          }
        }
      });

      setValue('teamMemberId.label', selectedTeamMemberDetails.name);
      setValue('teamMemberId.value', selectedTeamMemberDetails.id);
    }
  }, [
    isEditTeamMember,
    selectedTeamMemberDetails,
    selectedTeamMemberDetails.id,
    selectedTeamMemberDetails.name,
    selectedTeamMemberDetails.role,
    setValue,
  ]);
  return (
    <div>
      {isOpen && (
        <div className={modalStyle.modalOverlayDup}>
          <div className={modalStyle.modalDup}>
            <div className="mb-14 flex items-start justify-between">
              <h2 className="font-poppins text-lg font-semibold text-neutral-1">
                {isEditTeamMember ? (
                  <span>Edit team member</span>
                ) : (
                  <span>Add a team member</span>
                )}
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
                <div className="flex flex-col items-start">
                  <label
                    className="font-poppins text-base font-normal text-neutral-2"
                    htmlFor="teamMemberId"
                  >
                    Team member
                  </label>
                  {selectedOption && selectedOption.name && (
                    <small className="mt-2 font-poppins text-sm font-normal italic text-neutral-2">
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
                      isDisabled={isEditTeamMember}
                      onChange={(value) => {
                        if (value) {
                          const v = value as {
                            name: string;
                            value: string;
                            label: string;
                            role: NameJSONType;
                          };
                          Object.values(roleObj).forEach((d) => {
                            const locale = d.split('role')[1]?.toLowerCase();
                            if (locale) {
                              const val = v.role[locale];
                              if (val) {
                                setValue(
                                  d as keyof EditHospitalTeamMemberFormFields,
                                  // @ts-ignore
                                  val,
                                );
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
                {errors.teamMemberId && errors.teamMemberId.label && (
                  <div className="mt-1 text-start font-lexend text-base font-normal text-error">
                    {errors.teamMemberId.label.message}
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
                                border: '2px solid rgba(9, 111, 144, 1)',
                                color: 'rgba(9, 111, 144, 1)',
                                backgroundColor: 'rgba(242, 250, 252, 1)',
                              }
                            : {}
                        }
                        onClick={() => setActiveLanguageTab(data.language)}
                        className={`${(errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message ? '!border !border-error !text-error' : ''}`}
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

              {!isEditTeamMember && (
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
              )}
              <button
                className={`${addHospitalMemberToProcedure.isPending ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} flex w-[280px] items-center justify-center rounded-lg px-4 py-[15px]`}
                style={
                  isEditTeamMember
                    ? { marginTop: '36px' }
                    : { marginTop: '24px' }
                }
                type="submit"
              >
                {addHospitalMemberToProcedure.isPending ||
                editHospitalProcedureMember.isPending ? (
                  <ClipLoader
                    loading={
                      addHospitalMemberToProcedure.isPending ||
                      editHospitalProcedureMember.isPending
                    }
                    color="#fff"
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  // eslint-disable-next-line react/jsx-no-useless-fragment
                  <>
                    {isEditTeamMember ? (
                      <p className="font-poppins text-sm font-bold text-white">
                        Save changes
                      </p>
                    ) : (
                      <p className="font-poppins text-sm font-bold text-white">
                        Add member
                      </p>
                    )}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
