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
  CloseIcon,
  FileUploadIcon,
  Header,
  PlusIcon,
  WithAuth,
} from '@/components';
import {
  useEditHospital,
  useGetHospitalById,
  useRemoveGallery,
  useUpdateHospitalGallery,
  useUpdateHospitalLogo,
} from '@/hooks';
import type { LanguagesType } from '@/types/components';
import { countryData } from '@/utils/global';

import addHospitalStyle from '../../add/style.module.scss';

export type HospitalFormSchemaType =
  | 'hospitalDescEn'
  | 'hospitalDescNb'
  | 'hospitalDescDa'
  | 'hospitalDescSv';

const editHospitalFormSchema = z.object({
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
  logo: z.instanceof(File, { message: 'A file is required' }).optional(),
  gallery: z
    .array(z.instanceof(File))
    .min(1, 'At least one image is required')
    .max(3, 'You can upload up to 3 images')
    .optional(),
});
export type EditHospitalFormFields = z.infer<typeof editHospitalFormSchema>;
function EditHospital({ params: { id } }: { params: { id: string } }) {
  const [showLogoOverlay, setShowLogoOverlay] = React.useState<boolean>(false);
  const logoRef = React.useRef<HTMLInputElement>(null);
  const logoRefImgInput = React.useRef<HTMLInputElement>(null);
  const galleryRef = React.useRef<HTMLInputElement>(null);
  const editHospital = useEditHospital();
  const reqdHospital = useGetHospitalById({ id });
  const updateHospitalLogo = useUpdateHospitalLogo();
  const updateHospitalGallery = useUpdateHospitalGallery();
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');
  const [isActiveCancelModal, setIsActiveCancelModal] =
    React.useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditHospitalFormFields>({
    resolver: zodResolver(editHospitalFormSchema),
  });
  const logo = watch('logo');
  const gallery = watch('gallery');
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
  const onFormSubmit: SubmitHandler<EditHospitalFormFields> = (
    data: EditHospitalFormFields,
  ) => {
    editHospital.mutate({
      name: data.hospitalName,
      description: {
        en: data.hospitalDescEn,
        sv: data.hospitalDescSv,
        da: data.hospitalDescDa,
        nb: data.hospitalDescNb,
      },
      streetName: data.streetName,
      streetNumber: data.streetNumber,
      city: data.city,
      country: data.country,
      zipcode: data.zipCode,
      hospitalId: id,
    });
  };
  React.useEffect(() => {
    if (
      id &&
      reqdHospital.isSuccess &&
      reqdHospital.data &&
      reqdHospital.data.success
    ) {
      setValue('hospitalName', reqdHospital.data.data.name);
      setValue('hospitalDescEn', reqdHospital.data.data.description.da);
      setValue('hospitalDescNb', reqdHospital.data.data.description.sv);
      setValue('hospitalDescDa', reqdHospital.data.data.description.nb);
      setValue('hospitalDescSv', reqdHospital.data.data.description.nb);
      setValue('streetName', reqdHospital.data.data.streetName);
      setValue('city', reqdHospital.data.data.city);
      setValue('country', reqdHospital.data.data.country);
      setValue('streetNumber', reqdHospital.data.data.streetNumber);
      setValue('zipCode', reqdHospital.data.data.zipcode);
    }
  }, [reqdHospital.data, reqdHospital.isSuccess, setValue, id]);
  React.useEffect(() => {
    if (editHospital.isSuccess && editHospital.data && editHospital.data.data) {
      const logoVal = getValues('logo');
      if (logoVal) {
        const formData = new FormData();
        formData.append('logo', logoVal as Blob);
        updateHospitalLogo.mutate({
          hospitalId: `${editHospital.data.data}`,
          formData,
        });
      }
      const galleryVal = getValues('gallery');
      if (galleryVal) {
        const formData = new FormData();
        galleryVal.forEach((file) => {
          formData.append(`gallery`, file);
        });
        updateHospitalGallery.mutate({
          hospitalId: `${editHospital.data.data}`,
          formData,
        });
      }
      router.push(`/hospitals/add/${editHospital.data.data}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editHospital.data, editHospital.isSuccess]);
  const handleCancelBtn = () => {
    reset();
    router.back();
  };
  const removeGallery = useRemoveGallery({ id });
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
            style={{ marginBottom: '8px' }}
            className={addHospitalStyle.label}
          >
            Hospital logo
          </label>

          {!(
            reqdHospital.data &&
            reqdHospital.data.data.logo &&
            typeof reqdHospital.data.data.logo === 'string'
          ) && (
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
          )}

          {!logo &&
            reqdHospital.data &&
            reqdHospital.data.data.logo &&
            typeof reqdHospital.data.data.logo === 'string' && (
              <div className="relative size-[220px] rounded-full">
                <Image
                  src={reqdHospital.data.data.logo}
                  fill
                  priority
                  unoptimized
                  alt="hospital-logo"
                  className="ml-[-30px] rounded-full"
                />
                <div className="absolute left-2 top-0">
                  <Controller
                    name="logo"
                    control={control}
                    render={({ field: { name, onBlur, onChange } }) => (
                      <button
                        type="button"
                        className="relative flex size-[220px] flex-col items-center justify-center rounded-full border border-neutral-4"
                        style={{
                          marginLeft: '-40px',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        }}
                        onClick={() => logoRefImgInput.current?.click()}
                      >
                        {!getValues('logo') && (
                          <div className="flex size-10 items-center justify-center rounded-full border border-white p-2">
                            <FileUploadIcon stroke="#fff" />
                          </div>
                        )}
                        <input
                          type="file"
                          ref={logoRefImgInput}
                          name={name}
                          onBlur={onBlur}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                          }}
                          className="invisible absolute"
                        />
                        {!logo && (
                          <>
                            <p className="mt-3 font-poppins text-sm font-medium text-white">
                              Click to upload a image
                            </p>
                            <p className="font-lexend text-sm font-normal text-white">
                              PNG, JPG (max. 10 MB)
                            </p>
                          </>
                        )}
                      </button>
                    )}
                  />
                </div>
              </div>
            )}

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
                  style={
                    data.language === activeLanguageTab
                      ? {
                          border: '1px solid rgba(9, 111, 144, 1)',
                          color: 'rgba(9, 111, 144, 1)',
                          backgroundColor: 'rgba(242, 250, 252, 1)',
                        }
                      : {}
                  }
                  type="button"
                  onClick={() => setActiveLanguageTab(data.language)}
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

          <h3 className={addHospitalStyle.subTitleHospitalGallery}>
            Hospital gallery
          </h3>
          {gallery && gallery.length > 0 && (
            <div className=" flex w-full flex-wrap items-center gap-4">
              {gallery.map((image) => (
                <div className="relative" key={image.size}>
                  <Image
                    key={image.size}
                    src={`${URL.createObjectURL(image)}`}
                    width={64}
                    height={64}
                    alt="hospital-gallery"
                    className="h-[250px] w-[264px] rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
          {!gallery &&
            reqdHospital.data &&
            reqdHospital.data.data &&
            Array.isArray(reqdHospital.data.data.hospitalImages) &&
            reqdHospital.data.data.hospitalImages.length > 0 && (
              <div className=" flex w-full flex-wrap items-center gap-4">
                {reqdHospital.data.data.hospitalImages.map((image) => (
                  <div className="relative" key={image.id}>
                    <Image
                      key={image.id}
                      src={image.imageUrl}
                      width={64}
                      height={64}
                      alt="hospital-gallery"
                      className="h-[250px] w-[264px] rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2"
                      onClick={() => removeGallery.mutate({ id: image.id })}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
          {errors.gallery && (
            <small className="mt-1 text-start font-lexend text-base font-normal text-error">
              {errors.gallery.message}
            </small>
          )}
          <div className={addHospitalStyle.footerBtnContainer}>
            <button
              className={addHospitalStyle.cancelBtn}
              type="submit"
              onClick={handleCancelBtn}
            >
              <p>Cancel</p>
            </button>

            <button className={addHospitalStyle.publishBtn} type="submit">
              {editHospital.isPending ? (
                <ClipLoader
                  loading={editHospital.isPending}
                  color="#fff"
                  size={30}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <p>Edit</p>
              )}
            </button>
          </div>
        </form>
      </div>
      {isActiveCancelModal && (
        <CancelModal
          msg={`Are you sure you want to cancel editing the hospital procedure. You'll lose all responses collected. We can't recover them once you go back?`}
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

export default WithAuth(EditHospital);
