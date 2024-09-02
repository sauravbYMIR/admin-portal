/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
import { z } from 'zod';

import type { DepartmentType } from '@/app/procedures/CreateProcedureForm/CreateProcedureForm';
import {
  departmentTypeSchema,
  procedureTypeSchema,
} from '@/app/procedures/CreateProcedureForm/CreateProcedureForm';
import {
  AddTeamMemberToHospitalProcedure,
  BackArrowIcon,
  CancelModal,
  CloseIcon,
  FileUploadIcon,
  Header,
  PlusIcon,
  RemoveIcon,
  WithAuth,
} from '@/components';
import type { NameJSONType } from '@/hooks/useDepartment';
import { useGetAllDepartment } from '@/hooks/useDepartment';
import {
  useCreateHospitalProcedure,
  useUpdateHospitalProcedureGallery,
} from '@/hooks/useHospitalProcedure';
import { useGetAllProcedureByDeptId } from '@/hooks/useProcedure';
import emptyTeamMember from '@/public/assets/images/emptyTeamMember.svg';
import type { LanguagesType } from '@/types/components';
import type { AvailableCurrencyType } from '@/utils/global';
import {
  availableCountries,
  availableCurrency,
  countryData,
  handleGetLocalStorage,
  hospitalProcedureDescObj,
  ProcedureDescSchema,
} from '@/utils/global';

import addHospitalStyle from '../../../style.module.scss';
import type { HospitalProcedureFormSchemaType } from '../[procedureId]/edit/page';

type FormErrors = {
  [key in HospitalProcedureFormSchemaType]?: { message?: string };
} & {
  departmentName?: { message?: string };
  procedureName?: { message?: string };
  costType?: { message?: string };
  cost?: { message?: string };
  waitingTime?: { message?: string };
  stayInHospital?: { message?: string };
  stayInCity?: { message?: string };
  gallery?: { message?: string };
};

const createHospitalProcedureFormSchema = z.object({
  department: departmentTypeSchema,
  procedure: procedureTypeSchema,
  ...ProcedureDescSchema,
  cost: z.number({
    required_error: 'Cost in all language is required',
    invalid_type_error: 'Cost must be a number',
  }),
  costType: z.object({
    label: z.string().min(1, { message: 'Please select valid currency' }),
    value: z.enum(availableCurrency),
  }),
  waitingTime: z.string().min(1, { message: 'Waiting time is required' }),
  stayInHospital: z
    .string()
    .min(1, { message: 'Stay in hospital is required' }),
  stayInCity: z.string().min(1, { message: 'Stay in city is required' }),
  gallery: z
    .array(z.instanceof(File))
    .max(10, 'You can upload up to 10 images')
    .optional(),
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
          className="flex cursor-pointer items-center"
          onClick={() => {
            setTeamMembers((prevState) =>
              prevState.filter(
                (teamMemberInfo) => teamMemberInfo.member.id !== memberId,
              ),
            );
          }}
        >
          <RemoveIcon className="h-6 w-4" stroke="rgba(9, 111, 144, 1)" />
          <span className="ml-3 font-poppins text-base font-medium text-darkteal">
            Remove
          </span>
        </button>
      </div>
    </div>
  );
};
function AddHospitalProcedure({ params }: { params: { id: string } }) {
  const updateHospitalProcedureGallery = useUpdateHospitalProcedureGallery();
  const galleryRef = React.useRef<HTMLInputElement>(null);
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
  const [isActiveCancelModal, setIsActiveCancelModal] =
    React.useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<CreateHospitalProcedureFormFields>({
    resolver: zodResolver(createHospitalProcedureFormSchema),
  });
  const shouldRenderProcedureError = countryData.some((c) => {
    const lang = hospitalProcedureDescObj[
      c.language
    ] as HospitalProcedureFormSchemaType;
    return (
      (errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message
    );
  });
  const onFormSubmit: SubmitHandler<CreateHospitalProcedureFormFields> = (
    data: CreateHospitalProcedureFormFields,
  ) => {
    if (teamMembers.length === 0) {
      toast.info('Please add team member to proceed');
      return;
    }
    if (!data.costType) {
      toast.success('Please select valid cost type');
      return;
    }
    const descObj = Object.keys(data).reduce(
      (acc, curr) => {
        const value =
          curr.split('procedureDesc').length > 0
            ? curr.split('procedureDesc')[1]?.toLowerCase()
            : '';
        if (value) {
          // @ts-ignore
          acc[value] = data[curr as keyof EditHospitalProcedureFormFields];
        }
        return acc;
      },
      {} as Record<HospitalProcedureFormSchemaType, string>,
    );
    createHospitalProcedure.mutate({
      procedureId: data.procedure.value,
      hospitalId: params.id,
      description: { ...descObj },
      cost: {
        price: data.cost,
        currency: data.costType.value,
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
      const gallery = getValues('gallery');
      if (gallery) {
        const formData = new FormData();
        gallery.forEach((file) => {
          formData.append(`procedurePicture`, file);
        });
        updateHospitalProcedureGallery.mutate({
          hospitalProcedureId: `${createHospitalProcedure.data.data}`,
          formData,
        });
        reset();
      }
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
        allDepartment.data.data.map((department) => {
          if (department.parentCategoryId) {
            const parentCategory = allDepartment.data.data.find(
              (dept) => dept.id === department.parentCategoryId,
            );
            return {
              value: department.id,
              label: `${parentCategory?.name.en} -- ${department.name.en}`,
            };
          }
          return {
            value: department.id,
            label: department?.name.en ?? '',
          };
        }),
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
          label: procedure.name.en ?? '',
        })),
      );
    }
  }, [allProcedureByDeptId.data, allProcedureByDeptId.isSuccess]);
  React.useEffect(() => {
    if (
      createHospitalProcedure.isSuccess &&
      createHospitalProcedure.data?.data
    ) {
      router.push(
        `/hospitals/add/${params.id}/procedures/${createHospitalProcedure.data.data}`,
      );
    }
  }, [
    createHospitalProcedure.isError,
    createHospitalProcedure.isSuccess,
    router,
    createHospitalProcedure.data?.data,
    params.id,
  ]);
  const currencyOption = React.useMemo(() => {
    const unqiueCurrencies = new Set<string>();
    return countryData
      .filter((data) => {
        if (!unqiueCurrencies.has(data.currency)) {
          unqiueCurrencies.add(data.currency);
          return true;
        }
        return false;
      })
      .map((data) => ({
        value: data.currency as AvailableCurrencyType,
        label: data.currency,
      }));
  }, []);
  const hospitalCountry =
    handleGetLocalStorage({ tokenKey: 'hospital_country' }) ?? '';
  const gallery = watch('gallery');
  return (
    <div>
      <Header />

      <div className={addHospitalStyle.hospitalFormContainer}>
        <div className="flex items-center gap-x-14">
          <button
            type="button"
            onClick={() => setIsActiveCancelModal(true)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border-none bg-rgba244"
          >
            <BackArrowIcon strokeWidth="2" stroke="rgba(17, 17, 17, 0.8)" />
          </button>
          <h2 className="font-poppins text-3xl font-medium text-darkslategray">
            Add procedure
          </h2>
        </div>

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
                  placeholder="Search Department Name/ Sub-category"
                  {...field}
                  options={departmentList}
                  onChange={(value) => {
                    setSelectedOption(value);
                    setProcedureList([]);
                    field.onChange(value);
                  }}
                />
              )}
            />
            {errors.department && errors.department.label && (
              <div className="mt-1 text-start font-lexend text-base font-normal text-error">
                {errors.department.label.message}
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
            {errors.procedure && errors.procedure.label && (
              <div className="mt-1 text-start font-lexend text-base font-normal text-error">
                {errors.procedure.label.message}
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
                const lang = hospitalProcedureDescObj[
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
                    className={`${(errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message ? '!border-2 !border-error !text-error' : ''}`}
                  >
                    {data.language}
                  </button>
                );
              })}
            </div>

            {countryData.map((c) => {
              const lang = hospitalProcedureDescObj[
                c.language
              ] as HospitalProcedureFormSchemaType;
              return (
                <div key={c.countryCode} className="w-full">
                  {c.language === activeLanguageTab && (
                    <textarea
                      // eslint-disable-next-line jsx-a11y/no-autofocus
                      autoFocus
                      className={`${(errors as FormErrors)[lang]?.message ? 'outline-2 outline-error' : ''} h-[128px] w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3`}
                      placeholder="Enter procedure description"
                      id="procedure-description"
                      // @ts-ignore
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

          <div className="grid w-full grid-cols-2 gap-x-10 gap-y-4">
            <div className="relative my-4 flex w-full flex-col items-start">
              <label
                className="font-poppins text-base font-normal text-neutral-2"
                htmlFor="cost-of-procedure"
              >
                Expected cost of procedure
              </label>
              <Controller
                name="costType"
                control={control}
                defaultValue={
                  hospitalCountry &&
                  availableCountries[
                    hospitalCountry as keyof typeof availableCountries
                  ]
                    ? {
                        label:
                          availableCountries[
                            hospitalCountry as keyof typeof availableCountries
                          ].currency,
                        value: availableCountries[
                          hospitalCountry as keyof typeof availableCountries
                        ].currency as AvailableCurrencyType,
                      }
                    : { label: '', value: '' }
                }
                render={({ field }) => (
                  <Select
                    {...field}
                    className="absolute top-[14px] w-32"
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        borderRadius: '0.5rem',
                        padding: '0.165rem 1rem',
                      }),
                    }}
                    options={currencyOption}
                    onChange={(value) => {
                      if (value) {
                        field.onChange(value);
                      }
                    }}
                  />
                )}
              />
              <input
                className="mt-[-30px] w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
                style={{ paddingLeft: '135px' }}
                placeholder="Enter cost of procedure"
                id="cost-of-procedure"
                {...register('cost', { valueAsNumber: true })}
                type="number"
                onWheel={(e: React.WheelEvent<HTMLInputElement>) => {
                  const target = e.target as HTMLElement;
                  target.blur();
                }}
              />
              {errors.cost && (
                <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                  {errors.cost.message}
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
                placeholder="Enter waiting time (in days)"
                onWheel={(e: React.WheelEvent<HTMLInputElement>) => {
                  const target = e.target as HTMLElement;
                  target.blur();
                }}
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
                placeholder="Enter stay in hospital (in days)"
                onWheel={(e: React.WheelEvent<HTMLInputElement>) => {
                  const target = e.target as HTMLElement;
                  target.blur();
                }}
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
                placeholder="Enter stay in city (in days)"
                onWheel={(e: React.WheelEvent<HTMLInputElement>) => {
                  const target = e.target as HTMLElement;
                  target.blur();
                }}
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

          <div className="flex w-full flex-col items-start">
            <h3 className="mb-7 font-poppins text-lg font-normal text-neutral-1">
              Procedure related images (Optional)
            </h3>
            <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-2">
              {gallery && gallery.length > 0 && (
                <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2">
                  {gallery.map((file) => (
                    <div className="relative" key={file.size}>
                      <div className="size-[180px] cursor-pointer rounded-lg border border-neutral-4">
                        <Image
                          src={`${URL.createObjectURL(file)}`}
                          alt={`hospitalGallery-${file.size}`}
                          key={`hospitalGallery-${file.size}`}
                          fill
                          priority
                          unoptimized
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute right-4 top-4 z-10 rounded-full bg-white p-1"
                        onClick={() => {
                          const updatedGallery = gallery.filter(
                            (f) => f.lastModified !== file.lastModified,
                          );
                          setValue('gallery', updatedGallery);
                        }}
                      >
                        <CloseIcon className="size-4" strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {gallery ? (
                <button
                  className="mt-6 flex cursor-pointer gap-x-4 border-b-2 border-darkteal pb-1"
                  type="button"
                  onClick={() => galleryRef.current?.click()}
                >
                  <PlusIcon stroke="rgba(9, 111, 144, 1)" />
                  <span className="font-poppins text-base font-medium text-darkteal">
                    Add media
                  </span>
                  <Controller
                    name="gallery"
                    control={control}
                    render={({ field: { name, onBlur, onChange } }) => (
                      <input
                        type="file"
                        ref={galleryRef}
                        accept="image/*"
                        multiple
                        name={name}
                        onBlur={onBlur}
                        onChange={(e) => {
                          if (e.target.files) {
                            if (
                              gallery &&
                              Array.isArray(gallery) &&
                              gallery.length > 0
                            ) {
                              let totalImageFiles = Array.from(e.target.files);
                              totalImageFiles = [
                                ...totalImageFiles,
                                ...gallery,
                              ];
                              totalImageFiles = totalImageFiles.filter(
                                (file, index, self) =>
                                  index ===
                                  self.findIndex(
                                    (f) =>
                                      f.size === file.size &&
                                      f.name === file.name &&
                                      f.type === file.type &&
                                      f.lastModified === file.lastModified,
                                  ),
                              );
                              onChange(totalImageFiles);
                              return;
                            }
                            let files = Array.from(e.target.files);
                            files = files.filter(
                              (file, index, self) =>
                                index ===
                                self.findIndex(
                                  (f) =>
                                    f.size === file.size &&
                                    f.name === file.name &&
                                    f.type === file.type &&
                                    f.lastModified === file.lastModified,
                                ),
                            );
                            onChange(files);
                          }
                        }}
                        className="invisible absolute"
                      />
                    )}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  className={`flex size-[220px] flex-col items-center justify-center rounded-lg ${errors.gallery?.message ? 'border-[1.5px] border-error' : 'border border-neutral-4'}`}
                  onClick={() => galleryRef.current?.click()}
                >
                  {!gallery && (
                    <div className="flex size-10 items-center justify-center rounded-full border border-darkgray p-2">
                      <FileUploadIcon />
                    </div>
                  )}
                  <Controller
                    name="gallery"
                    control={control}
                    render={({ field: { name, onBlur, onChange } }) => (
                      <input
                        type="file"
                        ref={galleryRef}
                        accept="image/*"
                        multiple
                        name={name}
                        onBlur={onBlur}
                        onChange={(e) => {
                          if (e.target.files) {
                            const files = Array.from(e.target.files);
                            const updatedFiles = files.filter(
                              (file, index, self) =>
                                index ===
                                self.findIndex(
                                  (f) =>
                                    f.size === file.size &&
                                    f.name === file.name &&
                                    f.type === file.type &&
                                    f.lastModified === file.lastModified,
                                ),
                            );
                            onChange(updatedFiles);
                          }
                        }}
                        className="invisible absolute"
                      />
                    )}
                  />

                  <p className="mt-3 font-poppins text-xs font-semibold text-gray1">
                    click to upload an image
                  </p>
                  <p className="font-lexend text-xs font-medium text-gray2">
                    PNG, JPG (max. 10 MB)
                  </p>
                </button>
              )}
            </div>
          </div>

          {teamMembers.length > 0 ? (
            <div className="flex w-full flex-col items-start">
              <h3 className="my-8 font-poppins text-lg font-normal text-neutral-1">
                Team members
              </h3>
              <div className="flex flex-wrap items-center gap-6">
                {teamMembers.map((member) => {
                  return (
                    <HospitalMemberCard
                      name={member.member.name}
                      role={member.role.en ?? ''}
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
            <div className="flex w-full flex-col items-start">
              <h3 className="my-8 font-poppins text-lg font-normal text-neutral-1">
                Team members
              </h3>
              <div
                className="flex w-full flex-col items-center  justify-center rounded-xl border py-12"
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
                    Create team members
                  </p>
                </button>
              </div>
            </div>
          )}
          <div className="mt-16 w-full">
            <button
              className={`${createHospitalProcedure.isPending ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} flex w-[280px] items-center justify-center rounded-lg px-4 py-[15px]`}
              type="submit"
            >
              {createHospitalProcedure.isPending ? (
                <ClipLoader
                  loading={createHospitalProcedure.isPending}
                  color="#fff"
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <span className="font-poppins text-sm font-bold text-white">
                  Publish
                </span>
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
      {isActiveCancelModal && (
        <CancelModal
          heading="Are you sure you want to cancel creating hospital procedure?"
          msg={`You'll lose all responses collected. We can't recover them once you go back.`}
          onCancelHandler={() => {
            setIsActiveCancelModal(false);
          }}
          onAcceptHandler={() => {
            setIsActiveCancelModal(false);
            router.back();
          }}
          cancelMsg="No, Continue editing"
        />
      )}
    </div>
  );
}

export default WithAuth(AddHospitalProcedure);
