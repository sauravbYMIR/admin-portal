/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { z } from 'zod';

import {
  BackArrowIcon,
  CancelModal,
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
import { countryData } from '@/utils/global';

import addHospitalStyle from './style.module.scss';

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
  logo: z.instanceof(File, { message: 'A file is required' }),
  gallery: z
    .array(z.instanceof(File))
    .min(1, 'At least one image is required')
    .max(3, 'You can upload up to 3 images'),
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
      country: data.country,
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
        reset();
      }
      router.push(`/hospitals/edit/${createHospital.data.data.id}`);
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
  const handleCancelBtn = () => {
    router.back();
  };
  const logo = watch('logo');
  const gallery = watch('gallery');
  return (
    <div>
      <Header />

      <div className={addHospitalStyle.hospitalFormContainer}>
        <button
          type="button"
          onClick={() => router.push('/hospitals')}
          className="cursor-pointer border-none"
        >
          <BackArrowIcon />
        </button>
        <h2 className={addHospitalStyle.title}>Hospital profile</h2>

        <form
          className={addHospitalStyle.hospitalProfileForm}
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <label
            style={{ marginBottom: '10px' }}
            className={addHospitalStyle.label}
          >
            Hospital logo
          </label>
          <Controller
            name="logo"
            control={control}
            render={({ field: { name, onBlur, onChange } }) => (
              <button
                type="button"
                className="relative flex size-[220px] flex-col items-center justify-center rounded-full border border-neutral-4"
                style={{ marginLeft: '-40px' }}
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
                    <p className="mt-3 font-poppins text-sm font-medium text-white">
                      Replace image
                    </p>
                    <p className="font-lexend text-sm font-normal text-white">
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
                    <p className="mt-3 font-poppins text-sm font-medium text-darkgray">
                      Click to upload a image
                    </p>
                    <p className="font-lexend text-sm font-normal text-neutral-3">
                      PNG, JPG (max. 10 MB)
                    </p>
                  </>
                )}
              </button>
            )}
          />
          {errors.logo && (
            <small className="mt-1 text-start font-lexend text-base font-normal text-error">
              {errors.logo.message}
            </small>
          )}

          <label
            style={{ margin: '24px 0 8px' }}
            className={addHospitalStyle.label}
            htmlFor="hospital-name"
          >
            Hospital name
          </label>
          <input
            className={addHospitalStyle.input}
            type="text"
            placeholder="Type here"
            id="hospital-name"
            {...register('hospitalName')}
          />
          {errors.hospitalName && (
            <small className="mt-1 text-start font-lexend text-base font-normal text-error">
              {errors.hospitalName.message}
            </small>
          )}

          <label
            style={{ margin: '32px 0 0' }}
            className={addHospitalStyle.label}
            htmlFor="hospital-description"
          >
            Hospital Description
          </label>

          <div className={addHospitalStyle.langTabContainer}>
            {countryData.map((data) => {
              const lang = hospitalObj[data.language] as HospitalFormSchemaType;
              return (
                <button
                  key={data.locale}
                  type="button"
                  onClick={() => setActiveLanguageTab(data.language)}
                  style={
                    data.language === activeLanguageTab
                      ? {
                          border: '1px solid rgba(9, 111, 144, 1)',
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
            const lang = hospitalObj[c.language] as HospitalFormSchemaType;
            return (
              <div key={c.countryCode}>
                {c.language === activeLanguageTab && (
                  <textarea
                    className={addHospitalStyle.textarea}
                    placeholder="Type here"
                    id="hospital-description"
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

          <h3 className={addHospitalStyle.subTitleAddress}>Address</h3>

          <label
            style={{ marginBottom: '8px' }}
            className={addHospitalStyle.label}
            htmlFor="street-name"
          >
            Street name
          </label>
          <input
            style={{ marginBottom: '32px' }}
            className={addHospitalStyle.input}
            type="text"
            id="street-name"
            {...register('streetName')}
          />
          {errors.streetName && (
            <small className="mt-1 text-start font-lexend text-base font-normal text-error">
              {errors.streetName.message}
            </small>
          )}

          <label
            style={{ marginBottom: '8px' }}
            className={addHospitalStyle.label}
            htmlFor="street-number"
          >
            Street number
          </label>
          <input
            style={{ marginBottom: '32px' }}
            className={addHospitalStyle.input}
            type="text"
            id="street-number"
            {...register('streetNumber')}
          />
          {errors.streetNumber && (
            <small className="mt-1 text-start font-lexend text-base font-normal text-error">
              {errors.streetNumber.message}
            </small>
          )}

          <div className={addHospitalStyle.cityCountryInputWrapper}>
            <div className={addHospitalStyle.cityInputWrapper}>
              <label
                style={{ marginBottom: '8px' }}
                className={addHospitalStyle.label}
                htmlFor="city"
              >
                City
              </label>
              <input
                className={addHospitalStyle.input}
                type="text"
                id="city"
                {...register('city')}
              />
            </div>
            {errors.city && (
              <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                {errors.city.message}
              </small>
            )}

            <div className={addHospitalStyle.countryInputWrapper}>
              <label
                style={{ marginBottom: '8px' }}
                className={addHospitalStyle.label}
                htmlFor="country"
              >
                Country
              </label>
              <input
                className={addHospitalStyle.input}
                type="text"
                id="country"
                {...register('country')}
              />
              {errors.country && (
                <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                  {errors.country.message}
                </small>
              )}
            </div>
          </div>

          <label
            style={{ marginBottom: '8px' }}
            className={addHospitalStyle.label}
            htmlFor="zipCode"
          >
            Zip code
          </label>
          <input
            style={{ marginBottom: '64px' }}
            className={addHospitalStyle.input}
            type="text"
            id="zidCode"
            {...register('zipCode')}
          />
          {errors.zipCode && (
            <small className="mt-1 text-start font-lexend text-base font-normal text-error">
              {errors.zipCode.message}
            </small>
          )}

          <p className={addHospitalStyle.hospitalGalleryDesc}>
            Upload a minimum of 3 media items and maximum 10 media items
          </p>
          <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-2">
            {gallery && gallery.length > 0 && (
              <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2">
                {gallery.map((file) => (
                  <div
                    className="relative size-[220px] rounded-lg border border-neutral-4"
                    key={file.size}
                  >
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
                className="flex size-[220px] flex-col items-center justify-center rounded-lg border border-neutral-4"
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
                <p className="mt-3 font-poppins text-sm font-medium text-darkgray">
                  Click to upload a image
                </p>
                <p className="font-lexend text-sm font-normal text-neutral-3">
                  PNG, JPG (max. 10 MB)
                </p>
                {errors.gallery && (
                  <small className="mt-1 text-start font-lexend text-base font-normal text-error">
                    {errors.gallery.message}
                  </small>
                )}
              </button>
            )}
          </div>
          <div className={addHospitalStyle.footerBtnContainer}>
            <button
              className={addHospitalStyle.cancelBtn}
              type="button"
              onClick={handleCancelBtn}
            >
              <p>Cancel</p>
            </button>

            <button className={addHospitalStyle.publishBtn} type="submit">
              {createHospital.isPending ? (
                <ClipLoader
                  loading={createHospital.isPending}
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
      </div>
      {isActiveCancelModal && (
        <CancelModal
          msg={`Are you sure you want to cancel adding the hospital. You'll lose all responses collected. We can't recover them once you go back?`}
          onCancelHandler={() => {
            setIsActiveCancelModal(false);
          }}
          onAcceptHandler={() => {
            setIsActiveCancelModal(false);
            router.back();
          }}
          cancelMsg="No, Continue adding"
        />
      )}
    </div>
  );
}

export default WithAuth(AddHospital);
