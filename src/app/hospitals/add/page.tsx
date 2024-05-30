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
import countryList from 'react-select-country-list';
import { ClipLoader } from 'react-spinners';
import { z } from 'zod';

import {
  BackArrowIcon,
  CancelModal,
  CloseIcon,
  FileUploadIcon,
  Header,
  PlusIcon,
  WithAuth,
} from '@/components';
import {
  useCreateHospital,
  useUpdateHospitalGallery,
  useUpdateHospitalLogo,
} from '@/hooks';
import type { LanguagesType } from '@/types/components';
import { availableCountries, countryData } from '@/utils/global';

import addHospitalStyle from './style.module.scss';

export type HospitalFormSchemaType =
  | 'hospitalDescEn'
  | 'hospitalDescNb'
  | 'hospitalDescDa'
  | 'hospitalDescSv';

const countryTypeSchema = z.object({
  label: z.string().min(1, { message: 'Please select a country' }),
  value: z.string().min(1, { message: 'Please select a country' }),
});

const createHospitalFormSchema = z.object({
  hospitalName: z.string().min(1, { message: 'Fill in hospital name' }),
  hospitalDescEn: z
    .string()
    .min(1, { message: 'Add description in all languages' }),
  hospitalDescNb: z
    .string()
    .min(1, { message: 'Add description in all languages' }),
  hospitalDescDa: z
    .string()
    .min(1, { message: 'Add description in all languages' }),
  hospitalDescSv: z
    .string()
    .min(1, { message: 'Add description in all languages' }),
  streetName: z.string().min(1, { message: 'Street name is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  country: countryTypeSchema,
  streetNumber: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Street number is required',
  }),
  zipCode: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Zipcode is required',
  }),
  logo: z.instanceof(File, { message: 'Hospital logo is required' }),
  gallery: z
    .array(z.instanceof(File))
    .min(3, 'At least 3 image is required')
    .max(10, 'You can upload up to 10 images'),
});
export type CreateHospitalFormFields = z.infer<typeof createHospitalFormSchema>;
function AddHospital() {
  const [showLogoOverlay, setShowLogoOverlay] = React.useState<boolean>(false);
  const logoRef = React.useRef<HTMLInputElement>(null);
  const galleryRef = React.useRef<HTMLInputElement>(null);
  const updateHospitalLogo = useUpdateHospitalLogo();
  const updateHospitalGallery = useUpdateHospitalGallery();
  const createHospital = useCreateHospital();
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');
  const [isShowRemoveImgBtn, setIsShowRemoveImgBtn] = React.useState<{
    lastModified: number;
    isShow: boolean;
  }>({ lastModified: 0, isShow: false });
  const [selectedCountry, setSelectedCountry] = React.useState<{
    label: string;
    value: string;
  }>({
    label: '',
    value: '',
  });
  const [isActiveCancelModal, setIsActiveCancelModal] =
    React.useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    control,
    reset,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateHospitalFormFields>({
    resolver: zodResolver(createHospitalFormSchema),
  });
  const hospitalObj = {
    English: 'hospitalDescEn',
    Norwegian: 'hospitalDescNb',
    Danish: 'hospitalDescDa',
    Swedish: 'hospitalDescSv',
  };
  const shouldRenderProcedureError = countryData.some((c) => {
    const lang = hospitalObj[c.language] as HospitalFormSchemaType;
    return errors[lang] && errors[lang]?.message;
  });
  const onFormSubmit: SubmitHandler<CreateHospitalFormFields> = (
    data: CreateHospitalFormFields,
  ) => {
    createHospital.mutate({
      name: data.hospitalName,
      description: {
        en: data.hospitalDescEn,
        nb: data.hospitalDescNb,
        da: data.hospitalDescDa,
        sv: data.hospitalDescSv,
      },
      streetName: data.streetName,
      streetNumber: data.streetNumber,
      city: data.city,
      country: data.country.label,
      zipcode: data.zipCode,
    });
    setActiveLanguageTab('English');
  };
  React.useEffect(() => {
    if (
      createHospital.isSuccess &&
      createHospital.data &&
      createHospital.data.data.id
    ) {
      const logo = getValues('logo');
      if (logo) {
        const formData = new FormData();
        formData.append('logo', logo as Blob);
        updateHospitalLogo.mutate({
          hospitalId: `${createHospital.data.data.id}`,
          formData,
        });
      }
      const gallery = getValues('gallery');
      if (gallery) {
        const formData = new FormData();
        gallery.forEach((file) => {
          formData.append(`gallery`, file);
        });
        updateHospitalGallery.mutate({
          hospitalId: `${createHospital.data.data.id}`,
          formData,
        });
      }
      reset();
      router.push(`/hospitals/add/${createHospital.data.data.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    createHospital.data,
    createHospital.isSuccess,
    // getValues,
    // reset,
    // router,
    // updateHospitalGallery,
    // updateHospitalLogo,
  ]);
  const logo = watch('logo');
  const gallery = watch('gallery');
  const countryOptions = React.useMemo(
    () =>
      countryList()
        .getData()
        .filter(
          (country) =>
            availableCountries[
              country.label as keyof typeof availableCountries
            ],
        ),
    [],
  );
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
            Hospital profile
          </h2>
        </div>

        <form
          className={`${addHospitalStyle.hospitalProfileForm} mt-20`}
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="flex flex-col items-center justify-center">
            <Controller
              name="logo"
              control={control}
              render={({ field: { name, onBlur, onChange } }) => (
                <button
                  type="button"
                  className="relative flex size-[220px] flex-col items-center justify-center rounded-full border border-neutral-4"
                  onClick={() => logoRef.current?.click()}
                  onMouseEnter={() => setShowLogoOverlay(true)}
                  onMouseLeave={() => setShowLogoOverlay(false)}
                >
                  {showLogoOverlay && logo && (
                    <div
                      className="absolute left-0 top-0 z-10 flex size-[220px] flex-col items-center justify-center rounded-full"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      <div className="flex size-10 items-center justify-center rounded-full border border-white p-2">
                        <FileUploadIcon stroke="#fff" />
                      </div>
                      <p className="mt-3 font-poppins text-xs font-semibold text-white">
                        Replace image
                      </p>
                      <p className="font-lexend text-xs font-medium text-white">
                        PNG, JPG (max. 10 MB)
                      </p>
                    </div>
                  )}
                  {!getValues('logo') && (
                    <div className="flex size-10 items-center justify-center rounded-full border border-darkgray p-2">
                      <FileUploadIcon />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={logoRef}
                    name={name}
                    onBlur={onBlur}
                    accept="image/*"
                    // onChange={(e) => onChange(e.target.files?.[0])}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                    }}
                    className="invisible absolute"
                  />
                  {logo ? (
                    <Image
                      src={`${URL.createObjectURL(logo)}`}
                      alt="hospitalLogo"
                      key={`${logo}`}
                      fill
                      priority
                      unoptimized
                      style={{ backgroundImage: 'contain' }}
                      className="inline-block rounded-full"
                    />
                  ) : (
                    <>
                      <p className="mt-3 font-poppins text-xs font-semibold text-gray1">
                        click to upload an image
                      </p>
                      <p className="font-lexend text-xs font-medium text-gray2">
                        PNG, JPG (max. 10 MB)
                      </p>
                    </>
                  )}
                </button>
              )}
            />
            <label className="mt-3 font-poppins text-base font-normal text-neutral-2">
              Hospital logo
            </label>
            {errors.logo && (
              <small className="mt-1 text-start font-lexend text-sm font-normal text-error">
                {errors.logo.message}
              </small>
            )}
          </div>

          <div className="mt-[60px] w-[920px] rounded-xl bg-neutral-7 px-[60px] py-8">
            <div className="flex flex-col">
              <label
                className="mb-3 font-poppins text-base font-normal text-neutral-2"
                htmlFor="hospital-name"
              >
                Hospital name
              </label>
              <input
                className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
                type="text"
                placeholder="Enter hospital name"
                id="hospital-name"
                {...register('hospitalName')}
              />
              {errors.hospitalName && (
                <small className="mt-1 text-start font-lexend text-sm font-normal text-error">
                  {errors.hospitalName.message}
                </small>
              )}
            </div>

            <div className="flex flex-col">
              <label
                style={{ margin: '32px 0 0' }}
                className="mb-3 font-poppins text-base font-normal text-neutral-2"
                htmlFor="hospital-description"
              >
                Hospital Description
              </label>

              <div className={addHospitalStyle.langTabContainer}>
                {countryData.map((data) => {
                  const lang = hospitalObj[
                    data.language
                  ] as HospitalFormSchemaType;
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
                      className={`px-3 py-2 ${errors[lang] && errors[lang]?.message ? '!border-2 !border-error !text-error' : ''}`}
                    >
                      <span
                        className={`${errors[lang] && errors[lang]?.message ? '!text-error' : 'text-darkteal'} font-poppins text-sm font-medium`}
                      >
                        {data.language}
                      </span>
                    </button>
                  );
                })}
              </div>

              {countryData.map((c) => {
                const lang = hospitalObj[c.language] as HospitalFormSchemaType;
                return (
                  <div key={c.countryCode}>
                    {c.language === activeLanguageTab && (
                      <textarea
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                        className={`${errors[lang]?.message ? 'outline-2 outline-error' : ''} h-[150px]  w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3`}
                        placeholder="Enter hospital description"
                        id="hospital-description"
                        {...register(lang)}
                      />
                    )}
                  </div>
                );
              })}

              {shouldRenderProcedureError && (
                <small className="mt-1 text-start font-lexend text-sm font-normal text-error">
                  Fill in details in all the languages
                </small>
              )}
            </div>

            <div className="mt-7 flex flex-col">
              <h3 className="mb-7 font-poppins text-lg font-normal text-neutral-1">
                Address
              </h3>

              <div className="mb-7 flex flex-col items-start">
                <label
                  className="mb-3 font-poppins text-base font-normal text-neutral-2"
                  htmlFor="street-name"
                >
                  Street name
                </label>
                <input
                  className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
                  type="text"
                  id="street-name"
                  placeholder="Enter street name"
                  {...register('streetName')}
                />
                {errors.streetName && (
                  <small className="mt-1 text-start font-lexend text-sm font-normal text-error">
                    {errors.streetName.message}
                  </small>
                )}
              </div>
              <div className="mb-16 grid grid-cols-2 gap-x-10 gap-y-7">
                <div className="flex flex-col items-start">
                  <label
                    className="mb-3 font-poppins text-base font-normal text-neutral-2"
                    htmlFor="street-number"
                  >
                    Street number
                  </label>
                  <input
                    className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
                    type="text"
                    id="street-number"
                    placeholder="Enter street number"
                    {...register('streetNumber')}
                  />
                  {errors.streetNumber && (
                    <small className="mt-1 text-start font-lexend text-sm font-normal text-error">
                      {errors.streetNumber.message}
                    </small>
                  )}
                </div>

                <div className="flex flex-col items-start">
                  <label
                    className="mb-3 font-poppins text-base font-normal text-neutral-2"
                    htmlFor="country"
                  >
                    Country
                  </label>
                  <Controller
                    name="country"
                    control={control}
                    defaultValue={
                      selectedCountry?.label
                        ? selectedCountry
                        : { label: '', value: '' }
                    }
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            border: '2px solid rgba(217, 222, 231, 1)',
                            borderRadius: '0.5rem',
                            padding: '0.165rem 1rem',
                          }),
                        }}
                        options={countryOptions}
                        onChange={(value) => {
                          if (value) {
                            setSelectedCountry(value);
                            field.onChange(value);
                          }
                        }}
                      />
                    )}
                  />
                  {errors.country?.label?.message && (
                    <small className="mt-1 text-start font-lexend text-sm font-normal text-error">
                      {errors.country.label.message}
                    </small>
                  )}
                </div>

                <div className="flex flex-col items-start">
                  <label
                    className="mb-3 font-poppins text-base font-normal text-neutral-2"
                    htmlFor="city"
                  >
                    City
                  </label>
                  <input
                    className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
                    type="text"
                    id="city"
                    placeholder="Enter city"
                    {...register('city')}
                  />
                  {errors.city && (
                    <small className="mt-1 text-start font-lexend text-sm font-normal text-error">
                      {errors.city.message}
                    </small>
                  )}
                </div>

                <div className="flex flex-col items-start">
                  <label
                    className="mb-3 font-poppins text-base font-normal text-neutral-2"
                    htmlFor="zipCode"
                  >
                    Zip code
                  </label>
                  <input
                    className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
                    type="text"
                    id="zidCode"
                    placeholder="Enter zipcode"
                    {...register('zipCode')}
                  />
                  {errors.zipCode && (
                    <small className="mt-1 text-start font-lexend text-sm font-normal text-error">
                      {errors.zipCode.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <h3 className="mb-2 font-poppins text-lg font-normal text-neutral-1">
              Hospital Gallery
            </h3>
            <p
              className={`${errors.gallery?.message ? 'text-error' : 'text-neutral-2'} font-poppins text-base font-normal `}
            >
              Upload a minimum of 3 media items and maximum 10 media items
            </p>
            <div className="mt-7 flex w-full flex-wrap items-center gap-x-6 gap-y-2">
              {gallery && gallery.length > 0 && (
                <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2">
                  {gallery.map((file) => (
                    <div
                      onMouseEnter={() =>
                        setIsShowRemoveImgBtn(() => ({
                          lastModified: file.lastModified,
                          isShow: true,
                        }))
                      }
                      onMouseLeave={() =>
                        setIsShowRemoveImgBtn(() => ({
                          lastModified: file.lastModified,
                          isShow: false,
                        }))
                      }
                      className="relative size-[180px] cursor-pointer rounded-lg border border-neutral-4"
                      key={file.size}
                    >
                      {isShowRemoveImgBtn.lastModified === file.lastModified &&
                        isShowRemoveImgBtn.isShow && (
                          <button
                            type="button"
                            className="absolute right-4 top-4 z-10"
                            onClick={() => {
                              const updatedGallery = gallery.filter(
                                (f) =>
                                  f.lastModified !==
                                  isShowRemoveImgBtn.lastModified,
                              );
                              setValue('gallery', updatedGallery);
                            }}
                          >
                            <CloseIcon
                              className="mb-2 size-6"
                              strokeWidth={1.7}
                            />
                          </button>
                        )}
                      <Image
                        src={`${URL.createObjectURL(file)}`}
                        alt={`hospitalGallery-${file.size}`}
                        key={`hospitalGallery-${file.size}`}
                        fill
                        priority
                        unoptimized
                        className="object-contain"
                      />
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
                              let files = Array.from(e.target.files);
                              files = [...files, ...gallery];
                              onChange(files);
                              return;
                            }
                            const files = Array.from(e.target.files);
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
                            onChange(files);
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
                  {/* {errors.gallery && (
                    <small className="mt-1 text-start font-lexend text-sm font-normal text-error">
                      {errors.gallery.message}
                    </small>
                  )} */}
                </button>
              )}
            </div>
            <div className="mt-16 flex flex-col items-start gap-y-2">
              <small className="text-sm font-medium italic text-stone-500">
                Note: Once you add hospital, please provide elfsight iframe url
                or widget id to development team.
              </small>
              <button
                className={`${createHospital.isPending ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} flex w-[280px] items-center justify-center rounded-lg px-4 py-[15px]`}
                type="submit"
              >
                {createHospital.isPending ? (
                  <ClipLoader
                    loading={createHospital.isPending}
                    color="#fff"
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  <p className="font-poppins text-sm font-bold text-white">
                    Publish
                  </p>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      {isActiveCancelModal && (
        <CancelModal
          heading="Are you sure you want to cancel adding hospital?"
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

export default WithAuth(AddHospital);
