/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { FbtButton, FbtFileUpload } from '@frontbase/components-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { BackArrowIcon, Header } from '@/components';
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
});
export type CreateHospitalFormFields = z.infer<typeof createHospitalFormSchema>;
function AddHospital() {
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');
  const router = useRouter();
  const {
    register,
    handleSubmit,
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
  const handleCreateHospital = () => {
    // API call to create sub category
    setActiveLanguageTab('English');
  };
  const handleEditHospital = () => {
    // API call to create sub category
    setActiveLanguageTab('English');
  };
  const onFormSubmit: SubmitHandler<CreateHospitalFormFields> = () => {
    // TODO: WIP
    handleCreateHospital();
    handleEditHospital();
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
          <FbtFileUpload message="PNG, JPG (max. 10 MB)" />

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

          <FbtFileUpload message="PNG, JPG, MP4, MOV  (max. 10 MB)" />

          <div className={addHospitalStyle.footerBtnContainer}>
            <FbtButton
              className={addHospitalStyle.cancelBtn}
              size="sm"
              variant="outline"
              type="submit"
            >
              <p>Cancel</p>
            </FbtButton>

            <FbtButton
              className={addHospitalStyle.publishBtn}
              size="sm"
              variant="solid"
              type="submit"
            >
              <p>Publish</p>
            </FbtButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddHospital;
