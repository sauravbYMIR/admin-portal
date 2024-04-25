/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { FbtButton } from '@frontbase/components-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { z } from 'zod';

import { BackArrowIcon, Header, WithAuth } from '@/components';
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

const createHospitalProcedureFormSchema = z.object({
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
  logo: z.custom<File>((v) => v instanceof File, {
    message: 'Image is required',
  }),
  gallery: z.custom<File>((v) => v instanceof File, {
    message: 'Image is required',
  }),
});
export type CreateHospitalProcedureFormFields = z.infer<
  typeof createHospitalProcedureFormSchema
>;
function AddHospitalProcedure() {
  const updateHospitalLogo = useUpdateHospitalLogo();
  const updateHospitalGallery = useUpdateHospitalGallery();
  const createHospital = useCreateHospital();
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');
  const router = useRouter();
  const {
    register,
    control,
    reset,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CreateHospitalProcedureFormFields>({
    resolver: zodResolver(createHospitalProcedureFormSchema),
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
  const onFormSubmit: SubmitHandler<CreateHospitalProcedureFormFields> = (
    data: CreateHospitalProcedureFormFields,
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
      reset();
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
        formData.append('gallery', gallery as Blob);
        updateHospitalGallery.mutate({
          hospitalId: `${createHospital.data.data.id}`,
          formData,
        });
      }
      router.push(`/hospitals/edit/${createHospital.data.data.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createHospital.data, createHospital.isSuccess, reset]);
  const handleCancelBtn = () => {
    reset();
    router.back();
  };
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
            style={{ marginBottom: '6px' }}
            className={addHospitalStyle.label}
          >
            Hospital logo
          </label>
          <Controller
            name="logo"
            control={control}
            render={({ field: { ref, name, onBlur, onChange } }) => (
              <input
                type="file"
                ref={ref}
                name={name}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.files?.[0])}
              />
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

          <h3 className={addHospitalStyle.subTitleHospitalGallery}>
            Hospital gallery
          </h3>
          <p className={addHospitalStyle.hospitalGalleryDesc}>
            Upload a minimum of 3 media items and maximum 10 media items
          </p>

          <Controller
            name="gallery"
            control={control}
            render={({ field: { ref, name, onBlur, onChange } }) => (
              <input
                type="file"
                ref={ref}
                name={name}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.files?.[0])}
              />
            )}
          />
          {errors.gallery && (
            <small className="mt-1 text-start font-lexend text-base font-normal text-error">
              {errors.gallery.message}
            </small>
          )}

          <div className={addHospitalStyle.footerBtnContainer}>
            <FbtButton
              className={addHospitalStyle.cancelBtn}
              size="sm"
              variant="outline"
              type="submit"
              onClick={handleCancelBtn}
            >
              <p>Cancel</p>
            </FbtButton>

            <FbtButton
              className={addHospitalStyle.publishBtn}
              size="sm"
              variant="solid"
              type="submit"
            >
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
            </FbtButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WithAuth(AddHospitalProcedure);
