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

import { BackArrowIcon, Header, WithAuth } from '@/components';
import {
  useEditHospital,
  useGetHospitalById,
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
  logo: z
    .custom<File>((v) => v instanceof File, {
      message: 'Image is required',
    })
    .optional(),
  gallery: z
    .custom<File>((v) => v instanceof File, {
      message: 'Image is required',
    })
    .optional(),
});
export type EditHospitalFormFields = z.infer<typeof editHospitalFormSchema>;
function EditHospital({ params: { id } }: { params: { id: string } }) {
  const editHospital = useEditHospital();
  const reqdHospital = useGetHospitalById({ id });
  const updateHospitalLogo = useUpdateHospitalLogo();
  const updateHospitalGallery = useUpdateHospitalGallery();
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<EditHospitalFormFields>({
    resolver: zodResolver(editHospitalFormSchema),
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
      const logo = getValues('logo');
      if (logo) {
        const formData = new FormData();
        formData.append('logo', logo as Blob);
        updateHospitalLogo.mutate({
          hospitalId: `${editHospital.data.data}`,
          formData,
        });
      }
      const gallery = getValues('gallery');
      if (gallery) {
        const formData = new FormData();
        formData.append('gallery', gallery as Blob);
        updateHospitalGallery.mutate({
          hospitalId: `${editHospital.data.data}`,
          formData,
        });
      }
      router.push(`/hospitals/add/${editHospital.data.data}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    editHospital.data,
    editHospital.isSuccess,
    // getValues,
    // updateHospitalLogo,
    // updateHospitalGallery,
  ]);
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
          {reqdHospital.data &&
          reqdHospital.data.data.logo &&
          typeof reqdHospital.data.data.logo === 'string' ? (
            <Image
              src={reqdHospital.data.data.logo}
              width={64}
              height={64}
              alt="hospital-logo"
              className="rounded-full"
            />
          ) : (
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
          {reqdHospital.data &&
          reqdHospital.data.data &&
          typeof reqdHospital.data.data.gallery === 'string' ? (
            <Image
              src={reqdHospital.data.data.gallery}
              width={64}
              height={64}
              alt="hospital-gallery"
              className="h-[250px] w-[264px] rounded-lg"
            />
          ) : (
            <>
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
            </>
          )}
          {errors.gallery && (
            <small className="mt-1 text-start font-lexend text-base font-normal text-error">
              {errors.gallery.message}
            </small>
          )}
          <div className={addHospitalStyle.footerBtnContainer}>
            <button className={addHospitalStyle.cancelBtn} type="submit">
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
    </div>
  );
}

export default WithAuth(EditHospital);
