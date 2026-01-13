/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
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
import ImageCropperModal from '@/components/ImageCropperModal/ImageCropperModal';
import MultipleImageCropperModal from '@/components/ImageCropperModal/MulipleImageCropperModal';
import type { HospitalImageType } from '@/hooks';
import {
  useEditHospital,
  useGetHospitalById,
  useUpdateHospitalGallery,
  useUpdateHospitalLogo,
} from '@/hooks';
import useScrollToError from '@/hooks/useScrollToError';
import {
  availableCountries,
  countryData,
  handleFileSetter,
  handleMultipleFileSetter,
  hospitalDescObj,
  HospitalDescSchema,
} from '@/utils/global';

import type { HospitalDescFormSchemaType } from '../../add/page';
import addHospitalStyle from '../../add/style.module.scss';

const countryTypeSchema = z.object({
  label: z.string().min(1, { message: 'Please select a country' }),
  value: z.string().min(1, { message: 'Please select a country' }),
});

const editHospitalFormSchema = z.object({
  hospitalName: z.string().min(1, { message: 'Hospital name is required' }),
  ...HospitalDescSchema,
  streetName: z.string().min(1, { message: 'Street name is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  externalLink: z
    .string()
    .min(1, { message: 'External link is required' })
    .refine(
      (value) =>
        !value ||
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?$/.test(
          value,
        ),
      {
        message: 'Please provide a valid URL',
      },
    ),
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
    // .min(3, 'At least one image is required')
    .max(10, 'You can upload up to 10 images')
    .optional(),
});
// type FormErrors = {
//   [key in HospitalDescFormSchemaType]?: { message?: string };
// } & {
//   hospitalName?: { message?: string };
//   streetName?: { message?: string };
//   city?: { message?: string };
//   externalLink?: { message?: string };
//   country?: { message?: string };
//   streetNumber?: { message?: string };
//   zipCode?: { message?: string };
//   logo?: { message?: string };
//   gallery?: { message?: string };
// };
export type EditHospitalFormFields = z.infer<typeof editHospitalFormSchema>;
function EditHospital({ params: { id } }: { params: { id: string } }) {
  const ReactQuill = React.useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    [],
  );
  const [galleryImg, setGalleryImg] = React.useState<File[] | null>(null);
  const [isModalActiveGallery, setIsModalActiveGallery] =
    React.useState<boolean>(false);
  const [showLogoOverlay, setShowLogoOverlay] = React.useState<boolean>(false);
  const logoRef = React.useRef<HTMLInputElement>(null);
  const logoRefImgInput = React.useRef<HTMLInputElement>(null);
  const galleryRef = React.useRef<HTMLInputElement>(null);
  const editHospital = useEditHospital();
  const reqdHospital = useGetHospitalById({ id });
  const updateHospitalLogo = useUpdateHospitalLogo();
  const updateHospitalGallery = useUpdateHospitalGallery();
  const [hospitalDesc, setHospitalDesc] = React.useState<string>('');
  const [isActiveCancelModal, setIsActiveCancelModal] =
    React.useState<boolean>(false);
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
    formState: { errors },
  } = useForm<EditHospitalFormFields>({
    resolver: zodResolver(editHospitalFormSchema),
  });
  const [hospitalImages, setHospitalImages] = React.useState<
    Array<HospitalImageType>
  >([]);
  const [hospitalImageRemoveIds, setHospitalImageRemoveIds] = React.useState<
    Array<string>
  >([]);
  const [logoImg, setLogoImg] = React.useState<File | null>(null);
  const [isModalActiveLogo, setIsModalActiveLogo] =
    React.useState<boolean>(false);
  // const shouldRenderProcedureError = countryData.some((c) => {
  //   const lang = hospitalDescObj[c.language] as HospitalDescFormSchemaType;
  //   return (
  //     (errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message
  //   );
  // });
  const handleCheckIsNoOfImagesValid = (
    galleryImage: File[] | null | undefined,
    minimumNoOfImages: number,
  ) => {
    if (hospitalImages) {
      const noOfGalleryImage =
        Array.isArray(galleryImage) && galleryImage.length > 0
          ? galleryImage.length
          : 0;
      const noOfHospitalImage = hospitalImages.length;
      const totalImages = noOfHospitalImage + noOfGalleryImage;
      if (totalImages < minimumNoOfImages) {
        toast.error('Minimum of 3 hospital image need to be uploaded');
        return false;
      }
      return true;
    }
    return false;
  };
  const onFormSubmit: SubmitHandler<EditHospitalFormFields> = (
    data: EditHospitalFormFields,
  ) => {
    const isValidNoOfImages = handleCheckIsNoOfImagesValid(data.gallery, 3);
    if (!isValidNoOfImages) {
      return;
    }
    const hDescObj = Object.keys(data).reduce(
      (acc, curr) => {
        const value =
          curr.split('hospitalDesc').length > 0
            ? curr.split('hospitalDesc')[1]?.toLowerCase()
            : '';
        if (value) {
          // @ts-ignore
          acc[value] = data[curr as keyof EditHospitalFormFields];
        }
        return acc;
      },
      {} as Record<string, string>,
    );
    editHospital.mutate({
      name: data.hospitalName,
      description: {
        ...hDescObj,
      },
      streetName: data.streetName,
      streetNumber: data.streetNumber,
      city: data.city,
      country: data.country.label,
      zipcode: data.zipCode,
      hospitalId: id,
      removeImageIds: hospitalImageRemoveIds,
      externalLink: data.externalLink ?? '',
    });
  };
  React.useEffect(() => {
    if (
      id &&
      reqdHospital.isSuccess &&
      reqdHospital.data &&
      reqdHospital.data.success
    ) {
      if (
        Array.isArray(reqdHospital.data.data.hospitalImages) &&
        reqdHospital.data.data.hospitalImages.length > 0
      ) {
        setHospitalImages(reqdHospital.data.data.hospitalImages);
      }
      setValue('hospitalName', reqdHospital.data.data.name);
      Object.values(hospitalDescObj).forEach((d) => {
        const locale = d.split('hospitalDesc')[1]?.toLowerCase();
        if (locale) {
          const val = reqdHospital.data.data.description[locale];
          if (val) {
            setValue(d as keyof EditHospitalFormFields, val);
          }
        }
      });
      setHospitalDesc(reqdHospital.data.data.description.en as string);
      setValue('streetName', reqdHospital.data.data.streetName);
      setValue('city', reqdHospital.data.data.city);
      setValue('streetNumber', reqdHospital.data.data.streetNumber);
      setValue('zipCode', reqdHospital.data.data.zipcode);
      setValue('externalLink', reqdHospital.data.data.externalLink ?? '');
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
      if (logoImg) {
        const formData = new FormData();
        formData.append('logo', logoImg as Blob);
        updateHospitalLogo.mutate({
          hospitalId: `${editHospital.data.data}`,
          formData,
        });
      }
      if (galleryImg) {
        const formData = new FormData();
        galleryImg.forEach((file) => {
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
  useScrollToError(errors);
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
            {logoImg && (
              <Controller
                name="logo"
                control={control}
                render={() => (
                  <button
                    type="button"
                    className="relative flex size-[220px] flex-col items-center justify-center rounded-full border border-neutral-4"
                    onClick={() =>
                      !isModalActiveLogo && logoRef.current?.click()
                    }
                    onMouseEnter={() => setShowLogoOverlay(true)}
                    onMouseLeave={() => setShowLogoOverlay(false)}
                  >
                    {showLogoOverlay && logoImg && (
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
                    {!logoImg && (
                      <div className="flex size-10 items-center justify-center rounded-full border border-darkgray p-2">
                        <FileUploadIcon />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="invisible absolute"
                      ref={logoRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setValue('logo', e.target.files[0]);
                        }
                        handleFileSetter({
                          e,
                          imageSetter: setLogoImg,
                          setIsModalActive: setIsModalActiveLogo,
                        });
                      }}
                    />
                    {isModalActiveLogo && (
                      <ImageCropperModal
                        imageRef={logoRef}
                        imageFile={logoImg}
                        heading="Adjust your Logo"
                        setIsModalActive={setIsModalActiveLogo}
                        imageSetter={setLogoImg}
                        setValue={setValue}
                      />
                    )}
                    {logoImg ? (
                      <Image
                        src={`${URL.createObjectURL(logoImg)}`}
                        alt="hospitalLogo"
                        key={`${logoImg}`}
                        fill
                        priority
                        unoptimized
                        className="inline-block aspect-square rounded-full object-cover"
                      />
                    ) : (
                      <>
                        <p className="mt-3 font-poppins text-sm font-medium text-darkgray">
                          click to upload an image
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

            {!logoImg &&
              reqdHospital.data &&
              reqdHospital.data.data.logo &&
              typeof reqdHospital.data.data.logo === 'string' && (
                <div className="relative size-[220px] rounded-full">
                  <Image
                    src={`${reqdHospital.data.data.logo}?version=${new Date().getTime()}`}
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
                      render={() => (
                        <button
                          type="button"
                          className="relative flex size-[220px] flex-col items-center justify-center rounded-full border border-neutral-4"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          }}
                          onClick={() =>
                            !isModalActiveLogo &&
                            logoRefImgInput.current?.click()
                          }
                        >
                          {!logoImg && (
                            <div className="flex size-10 items-center justify-center rounded-full border border-white p-2">
                              <FileUploadIcon stroke="#fff" />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="invisible absolute"
                            ref={logoRefImgInput}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setValue('logo', e.target.files[0]);
                              }
                              handleFileSetter({
                                e,
                                imageSetter: setLogoImg,
                                setIsModalActive: setIsModalActiveLogo,
                              });
                            }}
                          />
                          {isModalActiveLogo && (
                            <ImageCropperModal
                              imageRef={logoRefImgInput}
                              imageFile={logoImg}
                              heading="Adjust your Logo"
                              setIsModalActive={setIsModalActiveLogo}
                              imageSetter={setLogoImg}
                              setValue={setValue}
                            />
                          )}
                          {!logoImg && (
                            <>
                              <p className="mt-3 font-poppins text-sm font-medium text-white">
                                click to upload an image
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

            {!logoImg &&
              !(
                reqdHospital.data &&
                reqdHospital.data.data.logo &&
                typeof reqdHospital.data.data.logo === 'string'
              ) && (
                <Controller
                  name="logo"
                  control={control}
                  render={() => (
                    <button
                      type="button"
                      className="relative flex size-[220px] flex-col items-center justify-center rounded-full border border-neutral-4"
                      onClick={() =>
                        !isModalActiveLogo && logoRef.current?.click()
                      }
                      onMouseEnter={() => setShowLogoOverlay(true)}
                      onMouseLeave={() => setShowLogoOverlay(false)}
                    >
                      {showLogoOverlay && logoImg && (
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
                      {!logoImg && (
                        <div className="flex size-10 items-center justify-center rounded-full border border-darkgray p-2">
                          <FileUploadIcon />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="invisible absolute"
                        ref={logoRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setValue('logo', e.target.files[0]);
                          }
                          handleFileSetter({
                            e,
                            imageSetter: setLogoImg,
                            setIsModalActive: setIsModalActiveLogo,
                          });
                        }}
                      />
                      {isModalActiveLogo && (
                        <ImageCropperModal
                          imageRef={logoRef}
                          imageFile={logoImg}
                          heading="Adjust your Logo"
                          setIsModalActive={setIsModalActiveLogo}
                          imageSetter={setLogoImg}
                          setValue={setValue}
                        />
                      )}
                      {logoImg ? (
                        <Image
                          src={`${URL.createObjectURL(logoImg)}`}
                          alt="hospitalLogo"
                          key={`${logoImg}`}
                          fill
                          priority
                          unoptimized
                          style={{ backgroundImage: 'contain' }}
                          className="inline-block rounded-full"
                        />
                      ) : (
                        <>
                          <p className="mt-3 font-poppins text-sm font-medium text-darkgray">
                            click to upload an image
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
            <div className="mb-3 flex flex-col">
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
                className="mt-3 font-poppins text-base font-normal text-neutral-2"
                htmlFor="hospital-description"
              >
                Hospital Description
              </label>

              {/* <div className={addHospitalStyle.langTabContainer}>
                {countryData.map((data) => {
                  const lang = hospitalDescObj[
                    data.language
                  ] as HospitalDescFormSchemaType;
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
                      className={`px-3 py-2 ${(errors as FormErrors)[lang] && (errors as FormErrors)[lang]?.message ? '!border-2 !border-error !text-error' : ''}`}
                      type="button"
                      onClick={() => {
                        setActiveLanguageTab(data.language);
                      }}
                    >
                      <span className="font-poppins text-sm font-medium text-darkteal">
                        {data.language}
                      </span>
                    </button>
                  );
                })}
              </div>

              {countryData.map((c) => {
                const lang = hospitalDescObj[
                  c.language
                ] as HospitalDescFormSchemaType;
                const hospitalDesc = watch(
                  lang as keyof EditHospitalFormFields,
                ) as string;
                return (
                  <div key={c.countryCode}>
                    {c.language === activeLanguageTab && (
                      <ReactQuill
                        theme="snow"
                        value={hospitalDesc}
                        onChange={(e) =>
                          setValue(lang as keyof EditHospitalFormFields, e)
                        }
                        className={`${(errors as FormErrors)[lang]?.message ? 'outline-2 outline-error' : ''} w-full rounded-lg placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3`}
                        placeholder="Enter hospital description"
                        id="hospital-description"
                      />
                    )}
                  </div>
                );
              })}

              {shouldRenderProcedureError && (
                <small className="mb-5 mt-1 text-start font-lexend text-base font-normal text-error">
                  Fill in details in all the languages
                </small>
              )} */}
              <ReactQuill
                theme="snow"
                value={hospitalDesc}
                onChange={(e) => {
                  setHospitalDesc(e);
                  // propagate same value to every language field
                  countryData.forEach((c) => {
                    const procField = hospitalDescObj[
                      c.language
                    ] as HospitalDescFormSchemaType;
                    setValue(procField as keyof EditHospitalFormFields, e);
                  });
                }}
                className={`${errors ? 'outline-2 outline-error' : ''} w-full rounded-lg placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3`}
                placeholder="Enter hospital description"
                id="hospital-description"
              />
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
                <div className="flex flex-col items-start">
                  <label
                    className="mb-3 font-poppins text-base font-normal text-neutral-2"
                    htmlFor="externalLink"
                  >
                    Hospital website link
                  </label>
                  <input
                    className="w-full rounded-lg border-2 border-lightsilver px-4 py-2 placeholder:text-sm placeholder:font-normal placeholder:text-neutral-3"
                    type="text"
                    placeholder="Enter external link"
                    id="externalLink"
                    {...register('externalLink')}
                  />
                  {errors.externalLink && (
                    <small className="mt-1 text-start font-lexend text-sm font-normal text-error">
                      {errors.externalLink.message}
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
            <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-8">
              {galleryImg && galleryImg.length > 0 && (
                <>
                  {galleryImg.map((image) => (
                    <div
                      className="relative size-[180px] cursor-pointer rounded-lg border border-neutral-4"
                      key={image.size}
                    >
                      <button
                        type="button"
                        className="absolute right-4 top-4 z-10 rounded-full bg-white p-1"
                        onClick={(e) => {
                          e.preventDefault();
                          const isValidNoOfImages =
                            handleCheckIsNoOfImagesValid(galleryImg, 4);
                          if (!isValidNoOfImages) {
                            return;
                          }
                          const updatedGallery = galleryImg.filter(
                            (f) => f.lastModified !== image.lastModified,
                          );
                          setGalleryImg(updatedGallery);
                        }}
                      >
                        <CloseIcon className="size-4" strokeWidth={3} />
                      </button>
                      <Image
                        key={image.size}
                        src={`${URL.createObjectURL(image)}`}
                        width={200}
                        height={180}
                        alt="hospital-gallery"
                        className="h-[180px] w-[200px] rounded-lg object-cover"
                      />
                    </div>
                  ))}
                </>
              )}
              {hospitalImages.length > 0 && (
                <>
                  {hospitalImages.map((image) => (
                    <div className="relative" key={image.id}>
                      <Image
                        key={image.id}
                        src={`${image.imageUrl}?version=${new Date().getTime()}`}
                        width={200}
                        height={200}
                        unoptimized
                        priority
                        alt="hospital-gallery"
                        className="relative aspect-square size-[200px] cursor-pointer rounded-lg border border-neutral-4 object-cover"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-4 z-10 rounded-full bg-white p-1"
                        onClick={(e) => {
                          e.preventDefault();
                          const isValidNoOfImages =
                            handleCheckIsNoOfImagesValid(galleryImg, 4);
                          if (!isValidNoOfImages) {
                            return;
                          }
                          setHospitalImages((prevState) =>
                            prevState.length > 0
                              ? prevState.filter(
                                  (hospitalImage) =>
                                    hospitalImage.id !== image.id,
                                )
                              : [],
                          );
                          setHospitalImageRemoveIds((prevState) => [
                            ...prevState,
                            image.id,
                          ]);
                        }}
                      >
                        <CloseIcon className="size-4" strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
            <button
              className="mt-6 flex cursor-pointer gap-x-4 border-b-2 border-darkteal pb-1"
              type="button"
              onClick={() =>
                !isModalActiveGallery && galleryRef.current?.click()
              }
            >
              <PlusIcon stroke="rgba(9, 111, 144, 1)" />
              <span className="font-poppins text-base font-medium text-darkteal">
                Add media
              </span>
              <Controller
                name="gallery"
                control={control}
                render={({ field: { name, onBlur } }) => (
                  <>
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
                            galleryImg &&
                            Array.isArray(galleryImg) &&
                            galleryImg.length > 0
                          ) {
                            let totalImageFiles = Array.from(e.target.files);
                            totalImageFiles = [
                              ...totalImageFiles,
                              ...galleryImg,
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
                            if (totalImageFiles) {
                              setValue('gallery', totalImageFiles);
                            }
                            handleMultipleFileSetter({
                              totalFiles: totalImageFiles,
                              imageSetter: setGalleryImg,
                              setIsModalActive: setIsModalActiveGallery,
                            });
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
                          if (files) {
                            setValue('gallery', files);
                          }
                          handleMultipleFileSetter({
                            totalFiles: files,
                            imageSetter: setGalleryImg,
                            setIsModalActive: setIsModalActiveGallery,
                          });
                        }
                      }}
                      className="invisible absolute"
                    />
                    {isModalActiveGallery && galleryImg && (
                      <MultipleImageCropperModal
                        imageFiles={galleryImg}
                        heading="Adjust your Image"
                        setIsModalActive={setIsModalActiveGallery}
                        imageSetter={setGalleryImg}
                        setValue={setValue}
                      />
                    )}
                  </>
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
