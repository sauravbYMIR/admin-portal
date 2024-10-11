/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  BackArrowIcon,
  CancelModal,
  CloseIcon,
  Header,
  PlusIcon,
  WithAuth,
} from '@/components';
import type { Locale } from '@/components/Modal/DepartmentModal/DepartmentModal';
import { useDisableNumberInputScroll } from '@/hooks/useDisableNumberInputScroll';
import type { HospitalProcedureImageType } from '@/hooks/useHospitalProcedure';
import {
  useEditHospitalProcedure,
  useGetHospitalProcedureById,
  useUpdateHospitalProcedureGallery,
} from '@/hooks/useHospitalProcedure';
import useScrollToError from '@/hooks/useScrollToError';
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

import addHospitalStyle from '../../../../style.module.scss';

export type HospitalProcedureFormSchemaType =
  `procedureDesc${Capitalize<Locale>}`;

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

const editHospitalProcedureFormSchema = z.object({
  departmentName: z.string(),
  procedureName: z.string(),
  costType: z.object({
    label: z.string().min(1, { message: 'Please select valid currency' }),
    value: z.enum(availableCurrency),
  }),
  cost: z.number({
    required_error: 'Cost in all language is required',
    invalid_type_error: 'Cost must be a number',
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
  ...ProcedureDescSchema,
});
export type EditHospitalProcedureFormFields = z.infer<
  typeof editHospitalProcedureFormSchema
>;
function EditHospitalProcedure({
  params,
}: {
  params: { id: string; procedureId: string };
}) {
  const [hospitalProcedureImages, setHospitalProcedureImages] = React.useState<
    Array<HospitalProcedureImageType>
  >([]);
  const [hospitalImageRemoveIds, setHospitalImageRemoveIds] = React.useState<
    Array<string>
  >([]);
  const galleryRef = React.useRef<HTMLInputElement>(null);
  const editHospitalProcedure = useEditHospitalProcedure();
  const hospitalProcedureDetails = useGetHospitalProcedureById({
    id: params.procedureId,
  });
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');
  const [isActiveCancelModal, setIsActiveCancelModal] =
    React.useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm<EditHospitalProcedureFormFields>({
    resolver: zodResolver(editHospitalProcedureFormSchema),
  });
  const updateHospitalProcedureGallery = useUpdateHospitalProcedureGallery();
  const shouldRenderProcedureError = countryData.some((c) => {
    const lang = hospitalProcedureDescObj[
      c.language
    ] as HospitalProcedureFormSchemaType;
    return (
      (errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message
    );
  });
  const onFormSubmit: SubmitHandler<EditHospitalProcedureFormFields> = (
    data: EditHospitalProcedureFormFields,
  ) => {
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
    editHospitalProcedure.mutate({
      waitingTime: data.waitingTime,
      stayInHospital: data.stayInHospital,
      stayInCity: data.stayInCity,
      description: { ...descObj },
      cost: {
        price: data.cost,
        currency: data.costType.value as AvailableCurrencyType,
      },
      hospitalProcedureId: params.procedureId,
      removeImageIds: hospitalImageRemoveIds,
    });
  };
  React.useEffect(() => {
    if (
      params.procedureId &&
      hospitalProcedureDetails.isSuccess &&
      hospitalProcedureDetails.data &&
      hospitalProcedureDetails.data.success
    ) {
      if (
        Array.isArray(
          hospitalProcedureDetails.data.data.hospitalProcedureImages,
        ) &&
        hospitalProcedureDetails.data.data.hospitalProcedureImages.length > 0
      ) {
        setHospitalProcedureImages(
          hospitalProcedureDetails.data.data.hospitalProcedureImages,
        );
      }
      if (hospitalProcedureDetails.data.data.procedure.category.name.en) {
        setValue(
          'departmentName',
          hospitalProcedureDetails.data.data.procedure.category.name.en,
        );
      }
      if (hospitalProcedureDetails.data.data.procedure.name.en) {
        setValue(
          'procedureName',
          hospitalProcedureDetails.data.data.procedure.name.en,
        );
      }
      Object.values(hospitalProcedureDescObj).forEach((d) => {
        const locale = d.split('procedureDesc')[1]?.toLowerCase();
        if (locale) {
          const val = hospitalProcedureDetails.data.data.description[locale];
          if (val) {
            setValue(d as keyof EditHospitalProcedureFormFields, val);
          }
        }
      });
      setValue('cost', hospitalProcedureDetails.data.data.cost.price);
      setValue('costType', {
        value: hospitalProcedureDetails.data.data.cost
          .currency as AvailableCurrencyType,
        label: hospitalProcedureDetails.data.data.cost.currency,
      });
      setValue('waitingTime', hospitalProcedureDetails.data.data.waitingTime);
      setValue('stayInCity', hospitalProcedureDetails.data.data.stayInCity);
      setValue('stayInHospital', hospitalProcedureDetails.data.data.stayInCity);
    }
  }, [
    hospitalProcedureDetails.data,
    hospitalProcedureDetails.isSuccess,
    setValue,
    params.procedureId,
  ]);
  React.useEffect(() => {
    if (
      editHospitalProcedure.isSuccess &&
      editHospitalProcedure.data &&
      editHospitalProcedure.data.data
    ) {
      const gallery = getValues('gallery');
      if (gallery) {
        const formData = new FormData();
        gallery.forEach((file) => {
          formData.append(`procedurePicture`, file);
        });
        updateHospitalProcedureGallery.mutate({
          hospitalProcedureId: `${editHospitalProcedure.data.data}`,
          formData,
        });
        reset();
      }
      router.push(
        `/hospitals/add/${params.id}/procedures/${editHospitalProcedure.data.data}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    editHospitalProcedure.data,
    editHospitalProcedure.isSuccess,
    // getValues,
    // updateHospitalLogo,
    // updateHospitalGallery,
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
  useScrollToError(errors);
  useDisableNumberInputScroll();
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
            Edit procedure
          </h2>
        </div>

        <form
          className={`${addHospitalStyle.hospitalProfileForm} mt-20 gap-y-8`}
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="flex w-full flex-col items-start">
            <label
              className="mb-3 font-poppins text-base font-normal text-neutral-2"
              htmlFor="deparment-sub-category"
            >
              Department/Sub-category
            </label>
            <input
              className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
              type="text"
              placeholder="Type here"
              id="deparment-sub-category"
              disabled
              {...register('departmentName')}
            />
            {errors.departmentName && (
              <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                {errors.departmentName.message}
              </small>
            )}
          </div>
          <div className="flex w-full flex-col items-start">
            <label
              className="mb-3 font-poppins text-base font-normal text-neutral-2"
              htmlFor="procedure"
            >
              Procedure
            </label>
            <input
              className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
              type="text"
              placeholder="Type here"
              id="procedure"
              disabled
              {...register('procedureName')}
            />
            {errors.procedureName && (
              <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                {errors.procedureName.message}
              </small>
            )}
          </div>
          <div className="flex w-full flex-col items-start">
            <label
              className="mb-3 font-poppins text-base font-normal text-neutral-2"
              htmlFor="hospital-procedure-description"
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
                    style={
                      data.language === activeLanguageTab
                        ? {
                            border: '2px solid rgba(9, 111, 144, 1)',
                            color: 'rgba(9, 111, 144, 1)',
                            backgroundColor: 'rgba(242, 250, 252, 1)',
                          }
                        : {}
                    }
                    type="button"
                    onClick={() => setActiveLanguageTab(data.language)}
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
              const procedureDesc = watch(
                lang as keyof EditHospitalProcedureFormFields,
              ) as string;
              return (
                <div key={c.countryCode} className="w-full">
                  {c.language === activeLanguageTab && (
                    <ReactQuill
                      theme="snow"
                      value={procedureDesc}
                      onChange={(e) =>
                        setValue(
                          lang as keyof EditHospitalProcedureFormFields,
                          e,
                        )
                      }
                      className={`${(errors as FormErrors)[lang]?.message ? 'outline-2 outline-error' : ''} w-full rounded-lg placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3`}
                      placeholder="Type here"
                      id="hospital-procedure-description"
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
            <div className="relative flex w-full flex-col items-start">
              <div className="relative flex w-full flex-col items-start">
                <label
                  className="mb-3 font-poppins text-base font-normal text-neutral-2"
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
            <div className="my-4 flex w-full flex-col items-start">
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
            <div className="my-4 flex w-full flex-col items-start">
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

          <div className="flex w-full flex-col items-start">
            <h3 className="mb-7 font-poppins text-lg font-normal text-neutral-1">
              Procedure related images
            </h3>

            <div className="flex w-full flex-col items-start gap-y-4">
              <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-8">
                {gallery && gallery.length > 0 && (
                  <>
                    {gallery.map((file) => (
                      <div
                        key={file.size}
                        className="relative size-[180px] cursor-pointer rounded-lg border border-neutral-4"
                      >
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
                        <Image
                          src={`${URL.createObjectURL(file)}`}
                          alt={`hospitalGallery-${file.size}`}
                          key={`hospitalGallery-${file.size}`}
                          fill
                          priority
                          unoptimized
                          // className="inline-block"
                        />
                      </div>
                    ))}
                  </>
                )}

                {hospitalProcedureDetails.data &&
                  hospitalProcedureDetails.data.data &&
                  hospitalProcedureDetails.data.data.hospitalProcedureImages &&
                  hospitalProcedureDetails.data.data.hospitalProcedureImages
                    .length > 0 && (
                    <>
                      {hospitalProcedureImages.map((file) => {
                        return (
                          <div key={file.id} className="relative">
                            <button
                              type="button"
                              className="absolute right-4 top-4 z-10 rounded-full bg-white p-1"
                              onClick={() => {
                                setHospitalProcedureImages((prevState) =>
                                  prevState.length > 0
                                    ? prevState.filter(
                                        (hospitalProcedureImage) =>
                                          hospitalProcedureImage.id !== file.id,
                                      )
                                    : [],
                                );
                                setHospitalImageRemoveIds((prevState) => [
                                  ...prevState,
                                  file.id,
                                ]);
                              }}
                            >
                              <CloseIcon className="size-4" strokeWidth={3} />
                            </button>
                            <Image
                              key={file.id}
                              src={`${file.imageUrl}?version=${new Date().getTime()}`}
                              width={250}
                              height={264}
                              alt="hospital-gallery"
                              className="aspect-square h-[250px] w-[264px] rounded-lg object-cover"
                            />
                          </div>
                        );
                      })}
                    </>
                  )}
              </div>
              <button
                type="button"
                className="mt-6 flex cursor-pointer gap-x-4 border-b-2 border-darkteal pb-1"
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
                            totalImageFiles = [...totalImageFiles, ...gallery];
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
              {errors.gallery && (
                <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                  {errors.gallery.message}
                </small>
              )}
            </div>
          </div>
          <div className="mt-16 w-full">
            <button
              className={`${editHospitalProcedure.isPending ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} flex w-[280px] items-center justify-center rounded-lg px-4 py-[15px]`}
              type="submit"
            >
              {editHospitalProcedure.isPending ? (
                <ClipLoader
                  loading={editHospitalProcedure.isPending}
                  color="#fff"
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <p className="font-poppins text-sm font-bold text-white">
                  Edit
                </p>
              )}
            </button>
          </div>
        </form>
      </div>
      {isActiveCancelModal && (
        <CancelModal
          heading="Are you sure you want to cancel editing procedure?"
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

export default WithAuth(EditHospitalProcedure);
