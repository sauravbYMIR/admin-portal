/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
import { z } from 'zod';

import type { DepartmentType } from '@/app/procedures/CreateProcedureForm/CreateProcedureForm';
import { departmentTypeSchema } from '@/app/procedures/CreateProcedureForm/CreateProcedureForm';
import {
  AddTeamMemberToHospitalProcedure,
  BackArrowIcon,
  Header,
  PlusIcon,
  RemoveIcon,
  WithAuth,
} from '@/components';
import type { NameJSONType } from '@/hooks/useDepartment';
import { useGetAllDepartment } from '@/hooks/useDepartment';
import { useCreateHospitalProcedure } from '@/hooks/useHospitalProcedure';
import { useGetAllProcedureByDeptId } from '@/hooks/useProcedure';
import type { LanguagesType } from '@/types/components';
import { countryData } from '@/utils/global';

import addHospitalStyle from '../../../style.module.scss';
import style from '../../hospitalDetailPage.module.scss';
import type {
  HospitalCostFormSchemaType,
  HospitalProcedureFormSchemaType,
} from '../[procedureId]/edit/page';

const createHospitalProcedureFormSchema = z.object({
  department: departmentTypeSchema,
  procedure: departmentTypeSchema,
  procedureDescEn: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  procedureDescNb: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  procedureDescDa: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  procedureDescSv: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  costEn: z.number({
    required_error: 'Cost in all language is required',
    invalid_type_error: 'Cost must be a number',
  }),
  costNb: z.number({
    required_error: 'Cost in all language is required',
    invalid_type_error: 'Cost must be a number',
  }),
  costDa: z.number({
    required_error: 'Cost in all language is required',
    invalid_type_error: 'Cost must be a number',
  }),
  costSv: z.number({
    required_error: 'Cost in all language is required',
    invalid_type_error: 'Cost must be a number',
  }),
  waitingTime: z.string().min(1, { message: 'Waiting time is required' }),
  stayInHospital: z
    .string()
    .min(1, { message: 'Stay in hospital is required' }),
  stayInCity: z.string().min(1, { message: 'Stay in city is required' }),
});
export type CreateHospitalProcedureFormFields = z.infer<
  typeof createHospitalProcedureFormSchema
>;
const HospitalMemberCard = ({
  name,
  role,
  setTeamMembers,
  memberId,
}: {
  memberId: string;
  name: string;
  role: string;
  setTeamMembers: React.Dispatch<
    React.SetStateAction<
      Array<{
        role: NameJSONType;
        member: {
          id: string;
          name: string;
        };
      }>
    >
  >;
}) => {
  return (
    <div className="flex w-[264px] flex-col items-start rounded-xl border border-neutral-5 px-5 py-3 shadow-md">
      <p className="font-poppins text-base font-medium text-neutral-1">
        {name}
      </p>
      <p className="font-lexend text-base font-light text-neutral-2">{role}</p>
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => {
            setTeamMembers((prevState) =>
              prevState.filter((member) => member.member.id !== memberId),
            );
          }}
        >
          <RemoveIcon className="h-6 w-4" stroke="rgba(9, 111, 144, 1)" />
        </button>
        <span className="ml-3 font-poppins text-base font-medium text-darkteal">
          Remove
        </span>
      </div>
    </div>
  );
};
const hospitalProcedureObj = {
  English: 'procedureDescEn',
  Norwegian: 'procedureDescNb',
  Danish: 'procedureDescDa',
  Swedish: 'procedureDescSv',
};
const costObj = {
  English: 'costEn',
  Norwegian: 'costNb',
  Danish: 'costDa',
  Swedish: 'costSv',
};
function AddHospitalProcedure({ params }: { params: { id: string } }) {
  const [isCreateHospitalTeamModal, setIsCreateHospitalTeamModal] =
    React.useState<boolean>(false);
  const createHospitalProcedure = useCreateHospitalProcedure();
  const [teamMembers, setTeamMembers] = React.useState<
    Array<{
      role: NameJSONType;
      member: {
        id: string;
        name: string;
      };
    }>
  >([]);
  const [departmentList, setDepartmentList] = React.useState<
    Array<DepartmentType>
  >([]);
  const [selectedOption, setSelectedOption] = React.useState<{
    label: string;
    value: string;
  } | null>(null);
  const [procedureList, setProcedureList] = React.useState<
    Array<DepartmentType>
  >([]);
  const [selectedOptionProcedure, setSelectedOptionProcedure] = React.useState<{
    label: string;
    value: string;
  } | null>(null);
  const allDepartment = useGetAllDepartment();
  const allProcedureByDeptId = useGetAllProcedureByDeptId({
    id: selectedOption?.value ?? '',
  });
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');
  const [activeCostTab, setActiveCostTab] =
    React.useState<LanguagesType>('English');
  const router = useRouter();
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateHospitalProcedureFormFields>({
    resolver: zodResolver(createHospitalProcedureFormSchema),
  });
  const shouldRenderProcedureError = countryData.some((c) => {
    const lang = hospitalProcedureObj[
      c.language
    ] as HospitalProcedureFormSchemaType;
    return errors[lang] && errors[lang]?.message;
  });
  const shouldRenderCostError = countryData.some((c) => {
    const lang = costObj[c.language] as HospitalCostFormSchemaType;
    return errors[lang] && errors[lang]?.message;
  });
  const onFormSubmit: SubmitHandler<CreateHospitalProcedureFormFields> = (
    data: CreateHospitalProcedureFormFields,
  ) => {
    if (teamMembers.length === 0) {
      toast('Please add team member to proceed');
      return;
    }
    createHospitalProcedure.mutate({
      procedureId: data.procedure.value,
      hospitalId: params.id,
      description: {
        en: data.procedureDescEn,
        da: data.procedureDescDa,
        nb: data.procedureDescNb,
        sv: data.procedureDescSv,
      },
      cost: {
        en: data.costEn,
        da: data.costDa,
        nb: data.costNb,
        sv: data.costSv,
      },
      waitingTime: data.waitingTime,
      stayInCity: data.stayInCity,
      stayInHospital: data.stayInHospital,
      procedureMembers: teamMembers.map((teamMemberInfo) => ({
        id: teamMemberInfo.member.id,
        role: teamMemberInfo.role,
      })),
    });
    setActiveLanguageTab('English');
  };
  React.useEffect(() => {
    if (
      createHospitalProcedure.isSuccess &&
      createHospitalProcedure.data &&
      createHospitalProcedure.data.data
    ) {
      reset();
      // const logo = getValues('logo');
      // if (logo) {
      //   const formData = new FormData();
      //   formData.append('logo', logo as Blob);
      //   updateHospitalLogo.mutate({
      //     hospitalId: `${createHospital.data.data.id}`,
      //     formData,
      //   });
      // }
      // const gallery = getValues('gallery');
      // if (gallery) {
      //   const formData = new FormData();
      //   formData.append('gallery', gallery as Blob);
      //   updateHospitalGallery.mutate({
      //     hospitalId: `${createHospital.data.data.id}`,
      //     formData,
      //   });
      // }
      router.push(`/hospitals/edit/${createHospitalProcedure.data.data}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createHospitalProcedure.data, createHospitalProcedure.isSuccess, reset]);
  React.useEffect(() => {
    if (
      allDepartment.isSuccess &&
      allDepartment.data &&
      Array.isArray(allDepartment.data.data) &&
      allDepartment.data.data.length > 0
    ) {
      setDepartmentList(() =>
        allDepartment.data.data.map((department) => ({
          value: department.id,
          label:
            department.name.en ||
            department.name.nb ||
            department.name.sv ||
            department.name.da,
        })),
      );
    }
  }, [allDepartment.data, allDepartment.isSuccess]);
  React.useEffect(() => {
    if (
      allProcedureByDeptId.isSuccess &&
      allProcedureByDeptId.data &&
      allProcedureByDeptId.data.data &&
      Array.isArray(allProcedureByDeptId.data.data) &&
      allProcedureByDeptId.data.data.length > 0
    ) {
      setProcedureList(() =>
        allProcedureByDeptId.data.data.map((procedure) => ({
          value: procedure.id,
          label:
            procedure.name.en ||
            procedure.name.nb ||
            procedure.name.sv ||
            procedure.name.da,
        })),
      );
    }
  }, [allProcedureByDeptId.data, allProcedureByDeptId.isSuccess]);
  const handleCancelBtn = () => {
    router.push('/hospitals');
  };
  React.useEffect(() => {
    if (createHospitalProcedure.isSuccess) {
      toast('Procedure added successfully');
      router.push('/procedures');
      return;
    }
    if (createHospitalProcedure.isError) {
      toast(
        'Oops! something went wrong while creating the procedure. Try again.',
      );
    }
  }, [
    createHospitalProcedure.isError,
    createHospitalProcedure.isSuccess,
    router,
  ]);
  return (
    <div>
      <Header />

      <div className={addHospitalStyle.hospitalFormContainer}>
        <button
          type="button"
          onClick={() => router.push('/hospitals')}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full border-none bg-rgba244"
        >
          <BackArrowIcon strokeWidth="2" stroke="rgba(17, 17, 17, 0.8)" />
        </button>
        <h2 className={addHospitalStyle.title}>Add procedure</h2>

        <form
          className={`${addHospitalStyle.hospitalProfileForm} mt-20 gap-y-8`}
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="flex w-full flex-col items-start">
            <label
              className="mb-3 font-poppins text-base font-normal text-neutral-2"
              htmlFor="department"
            >
              Department name/ Sub-category
            </label>
            <Controller
              name="department"
              control={control}
              defaultValue={
                selectedOption?.label
                  ? selectedOption
                  : { label: '', value: '' }
              }
              render={({ field }) => (
                <Select
                  className="w-full"
                  {...field}
                  options={departmentList}
                  onChange={(value) => {
                    setSelectedOption(value);
                    field.onChange(value);
                  }}
                />
              )}
            />
            {errors.department && (
              <div className="mt-1 text-start font-lexend text-base font-normal text-error">
                {errors.department.message}
              </div>
            )}
          </div>

          <div className="flex w-full flex-col items-start">
            <label
              className="mb-3 font-poppins text-base font-normal text-neutral-2"
              htmlFor="procedure"
            >
              Procedure name
            </label>
            <Controller
              name="procedure"
              control={control}
              defaultValue={
                selectedOptionProcedure?.label
                  ? selectedOptionProcedure
                  : { label: '', value: '' }
              }
              render={({ field }) => (
                <Select
                  className="w-full"
                  {...field}
                  options={procedureList}
                  onChange={(value) => {
                    setSelectedOptionProcedure(value);
                    field.onChange(value);
                  }}
                />
              )}
            />
            {errors.department && (
              <div className="mt-1 text-start font-lexend text-base font-normal text-error">
                {errors.department.message}
              </div>
            )}
          </div>

          <div className="flex w-full flex-col items-start">
            <label
              className="mt-3 font-poppins text-base font-normal text-neutral-2"
              htmlFor="procedure-description"
            >
              Procedure Description
            </label>

            <div className={addHospitalStyle.langTabContainer}>
              {countryData.map((data) => {
                const lang = hospitalProcedureObj[
                  data.language
                ] as HospitalProcedureFormSchemaType;
                return (
                  <button
                    key={data.locale}
                    type="button"
                    onClick={() => setActiveLanguageTab(data.language)}
                    style={
                      data.language === activeLanguageTab
                        ? {
                            border: '2px solid rgba(9, 111, 144, 1)',
                            color: 'rgba(9, 111, 144, 1)',
                            backgroundColor: 'rgba(242, 250, 252, 1)',
                          }
                        : {}
                    }
                    className={`${errors[lang] && errors[lang]?.message ? '!border !border-error !text-error' : ''}`}
                  >
                    {data.language}
                  </button>
                );
              })}
            </div>

            {countryData.map((c) => {
              const lang = hospitalProcedureObj[
                c.language
              ] as HospitalProcedureFormSchemaType;
              return (
                <div key={c.countryCode} className="w-full">
                  {c.language === activeLanguageTab && (
                    <textarea
                      // eslint-disable-next-line jsx-a11y/no-autofocus
                      autoFocus
                      className={`${errors[lang]?.message ? 'outline-2 outline-error' : ''} h-[128px] w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3`}
                      placeholder="Type here"
                      id="procedure-description"
                      {...register(lang)}
                    />
                  )}
                </div>
              );
            })}

            {shouldRenderProcedureError && (
              <small className="mb-5 mt-1 text-start font-lexend text-base font-normal text-error">
                Fill in details in all the languages
              </small>
            )}
          </div>

          <div className="grid w-full grid-cols-2 gap-4">
            <div className="relative my-4 flex w-full flex-col items-start">
              <label
                className="mb-3 font-poppins text-base font-normal text-neutral-2"
                htmlFor="cost-of-procedure"
              >
                Expected cost of procedure
              </label>

              <div className="absolute top-[38px]">
                <select
                  name="cost-of-procedure"
                  id="cost-of-procedure"
                  className="rounded-md border-2 border-neutral-4 bg-neutral-6 px-5 py-[8px]"
                  onChange={(e) =>
                    setActiveCostTab(e.target.value as LanguagesType)
                  }
                >
                  {countryData.map((country) => {
                    return (
                      <option value={country.language} key={country.language}>
                        <span>{country.currency}</span>
                      </option>
                    );
                  })}
                </select>
              </div>

              {countryData.map((c) => {
                const costLang = costObj[
                  c.language
                ] as HospitalProcedureFormSchemaType;
                return (
                  <div key={c.countryCode} className="w-full">
                    {c.language === activeCostTab && (
                      <input
                        className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
                        style={{ paddingLeft: '110px' }}
                        id="cost-of-procedure"
                        {...register(costLang, { valueAsNumber: true })}
                      />
                    )}
                  </div>
                );
              })}

              {shouldRenderCostError && (
                <small className="mb-5 mt-1 text-start font-lexend text-base font-normal text-error">
                  Fill in details in all the languages
                </small>
              )}
            </div>
            <div className="my-4 flex w-full flex-col items-start">
              <label
                className="mb-3 font-poppins text-base font-normal text-neutral-2"
                htmlFor="waiting-time"
              >
                Expected waiting time for the procedure in days
              </label>
              <input
                className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
                type="number"
                id="waiting-time"
                {...register('waitingTime')}
              />
              {errors.waitingTime && (
                <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                  {errors.waitingTime.message}
                </small>
              )}
            </div>
            <div
              className="my-4 flex w-full flex-col items-start"
              style={{ marginBottom: '32px' }}
            >
              <label
                className="mb-3 font-poppins text-base font-normal text-neutral-2"
                htmlFor="stay-in-hospital"
              >
                Expected length of stay in the hospital in days
              </label>
              <input
                className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
                type="number"
                id="stay-in-hospital"
                {...register('stayInHospital')}
              />
              {errors.stayInHospital && (
                <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                  {errors.stayInHospital.message}
                </small>
              )}
            </div>
            <div
              className="my-4 flex w-full flex-col items-start"
              style={{ marginBottom: '32px' }}
            >
              <label
                className="mb-3 font-poppins text-base font-normal text-neutral-2"
                htmlFor="stay-in-city"
              >
                Expected length of stay in the city in days
              </label>
              <input
                className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
                type="number"
                id="stay-in-city"
                {...register('stayInCity')}
              />
              {errors.stayInCity && (
                <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                  {errors.stayInCity.message}
                </small>
              )}
            </div>
          </div>
          {teamMembers.length > 0 ? (
            <div className={style.teamMemberCardsContainer}>
              <h3 className="my-8 font-poppins text-2xl font-medium text-black">
                Team members
              </h3>
              <div className="flex flex-wrap items-center gap-6">
                {teamMembers.map((member) => {
                  return (
                    <HospitalMemberCard
                      name={member.member.name}
                      role={member.role.en}
                      key={`${member.member.name}-${member.role.en}`}
                      setTeamMembers={setTeamMembers}
                      memberId={member.member.id}
                    />
                  );
                })}
              </div>
              <button
                type="button"
                className="mt-6 flex w-[188px] items-center justify-between text-darkteal"
                onClick={() => setIsCreateHospitalTeamModal(true)}
                style={{
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(9, 111, 144, 1)',
                }}
              >
                <PlusIcon className="size-4" stroke="rgba(9, 111, 144, 1)" />
                <span>Add a team member</span>
              </button>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center  justify-center rounded-xl bg-neutral-7 py-12">
              <p className="mb-7 text-center font-poppins text-4xl font-medium">
                No team members have been created yet!
              </p>

              <button
                onClick={() => setIsCreateHospitalTeamModal(true)}
                className="flex items-center justify-center rounded-[6.4px] bg-darkteal px-6 py-[14px] text-white"
                type="button"
              >
                <p className="font-poppins text-2xl font-normal">
                  Create team members
                </p>
              </button>
            </div>
          )}
          <div className={addHospitalStyle.footerBtnContainer}>
            <button
              className={addHospitalStyle.cancelBtn}
              type="button"
              onClick={handleCancelBtn}
            >
              <p>Cancel</p>
            </button>

            <button className={addHospitalStyle.publishBtn} type="submit">
              {createHospitalProcedure.isPending ? (
                <ClipLoader
                  loading={createHospitalProcedure.isPending}
                  color="#fff"
                  size={30}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <p>Publish</p>
              )}
            </button>
          </div>
        </form>
        <AddTeamMemberToHospitalProcedure
          hospitalId={params.id}
          isOpen={isCreateHospitalTeamModal}
          onClose={() => setIsCreateHospitalTeamModal(false)}
          setTeamMembers={setTeamMembers}
          teamMembers={teamMembers}
        />
      </div>
    </div>
  );
}

export default WithAuth(AddHospitalProcedure);
