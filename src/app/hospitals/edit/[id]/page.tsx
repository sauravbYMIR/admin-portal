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
const countryTypeSchema = z.object({
  label: z.string().min(1, { message: 'Please select a country' }),
  value: z.string().min(1, { message: 'Please select a country' }),
});

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
  streetNumber: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Street number is required',
  }),
  zipCode: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Zipcode is required',
  }),
  country: countryTypeSchema,
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
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
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
      country: data.country.label,
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
      setValue('hospitalDescEn', reqdHospital.data.data.description.en);
      setValue('hospitalDescNb', reqdHospital.data.data.description.nb);
      setValue('hospitalDescDa', reqdHospital.data.data.description.da);
      setValue('hospitalDescSv', reqdHospital.data.data.description.sv);
      setValue('streetName', reqdHospital.data.data.streetName);
      setValue('city', reqdHospital.data.data.city);
      setValue('streetNumber', reqdHospital.data.data.streetNumber);
      setValue('zipCode', reqdHospital.data.data.zipcode);
      setValue('country', {
        value:
          countryList()
            .getData()
            .find((c) => c.label === reqdHospital.data.data.country)?.value ??
          '',
        label: reqdHospital.data.data.country,
      });
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
  const removeGallery = useRemoveGallery({ id });
  const countryOptions = React.useMemo(() => countryList().getData(), []);
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
            {logo && (
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
                    className="rounded-full"
                  />
                  <div className="absolute left-0 top-0">
                    <Controller
                      name="logo"
                      control={control}
                      render={({ field: { name, onBlur, onChange } }) => (
                        <button
                          type="button"
                          className="relative flex size-[220px] flex-col items-center justify-center rounded-full border border-neutral-4"
                          style={{
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

            <label
              style={{ marginBottom: '8px' }}
              className="mt-3 font-poppins text-base font-normal text-neutral-2"
            >
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
                placeholder="Type here"
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
                className="mb-3 font-poppins text-base font-normal text-neutral-2"
                htmlFor="hospital-description"
              >
                Hospital Description
              </label>

              <div className={addHospitalStyle.langTabContainer}>
                {countryData.map((data) => {
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
                      className="px-3 py-2"
                      type="button"
                      onClick={() => setActiveLanguageTab(data.language)}
                    >
                      <span className="font-poppins text-sm font-medium text-darkteal">
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
                        className={`${errors[lang]?.message ? 'outline-2 outline-error' : ''} w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3`}
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
                    htmlFor="city"
                  >
                    City
                  </label>
                  <input
                    className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
                    type="text"
                    id="city"
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
                    htmlFor="zipCode"
                  >
                    Zip code
                  </label>
                  <input
                    className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
                    type="text"
                    id="zidCode"
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

            <div className="mb-7">
              <h3 className="mb-2 font-poppins text-lg font-normal text-neutral-1">
                Hospital gallery
              </h3>
              <p
                className={`${errors.gallery?.message ? 'text-error' : 'text-neutral-2'} font-poppins text-base font-normal `}
              >
                Upload a minimum of 3 media items and maximum 10 media items
              </p>
            </div>
            {gallery && gallery.length > 0 && (
              <div className="flex w-full flex-wrap items-center gap-4">
                {gallery.map((image) => (
                  <div
                    className="relative size-[180px] cursor-pointer rounded-lg border border-neutral-4"
                    key={image.size}
                    onMouseEnter={() =>
                      setIsShowRemoveImgBtn(() => ({
                        lastModified: image.lastModified,
                        isShow: true,
                      }))
                    }
                    onMouseLeave={() =>
                      setIsShowRemoveImgBtn(() => ({
                        lastModified: image.lastModified,
                        isShow: false,
                      }))
                    }
                  >
                    {isShowRemoveImgBtn.lastModified === image.lastModified &&
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
                      key={image.size}
                      src={`${URL.createObjectURL(image)}`}
                      width={200}
                      height={200}
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
                        width={200}
                        height={200}
                        alt="hospital-gallery"
                        objectFit="contain"
                        className="relative size-[200px] cursor-pointer rounded-lg border border-neutral-4"
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
              <small className="mt-1 text-start font-lexend text-sm font-normal text-error">
                {errors.gallery.message}
              </small>
            )}
            <div className="mt-16">
              <button
                className={`${editHospital.isPending ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} flex w-[280px] items-center justify-center rounded-lg px-4 py-[15px]`}
                type="submit"
              >
                {editHospital.isPending ? (
                  <ClipLoader
                    loading={editHospital.isPending}
                    color="#fff"
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  <p className="font-poppins text-sm font-bold text-white">
                    Save changes
                  </p>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      {isActiveCancelModal && (
        <CancelModal
          heading="Are you sure you want to cancel editing hospital?"
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

export default WithAuth(EditHospital);
