/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { z } from 'zod';

import { BackArrowIcon, Header, WithAuth } from '@/components';
import {
  useEditHospitalProcedure,
  useGetHospitalProcedureById,
} from '@/hooks/useHospitalProcedure';
import type { LanguagesType } from '@/types/components';
import { countryData } from '@/utils/global';

import addHospitalStyle from '../../../../style.module.scss';

export type HospitalProcedureFormSchemaType =
  | 'procedureDescEn'
  | 'procedureDescNb'
  | 'procedureDescDa'
  | 'procedureDescSv';

const editHospitalProcedureFormSchema = z.object({
  departmentName: z.string(),
  procedureName: z.string(),
  procedureDescEn: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  procedureDescNb: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  procedureDescDa: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  procedureDescSv: z
    .string()
    .min(1, { message: 'Fill in details in all the languages' }),
  costEn: z.number({
    required_error: 'Cost in all language is required',
    invalid_type_error: 'Cost must be a number',
  }),
  costNb: z.number({
    required_error: 'Cost in all language is required',
    invalid_type_error: 'Cost must be a number',
  }),
  costDa: z.number({
    required_error: 'Cost in all language is required',
    invalid_type_error: 'Cost must be a number',
  }),
  costSv: z.number({
    required_error: 'Cost in all language is required',
    invalid_type_error: 'Cost must be a number',
  }),
  waitingTime: z.string().min(1, { message: 'Waiting time is required' }),
  stayInHospital: z
    .string()
    .min(1, { message: 'Stay in hospital is required' }),
  stayInCity: z.string().min(1, { message: 'Stay in city is required' }),
  // gallery: z
  //   .custom<File>((v) => v instanceof File, {
  //     message: 'Image is required',
  //   })
  //   .optional(),
});
export type EditHospitalProcedureFormFields = z.infer<
  typeof editHospitalProcedureFormSchema
>;
function EditHospitalProcedure({
  params,
}: {
  params: { id: string; procedureId: string };
}) {
  const editHospitalProcedure = useEditHospitalProcedure();
  const hospitalProcedureDetails = useGetHospitalProcedureById({
    id: params.procedureId,
  });
  const [activeLanguageTab, setActiveLanguageTab] =
    React.useState<LanguagesType>('English');
  const router = useRouter();
  const {
    register,
    // control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditHospitalProcedureFormFields>({
    resolver: zodResolver(editHospitalProcedureFormSchema),
  });
  const hospitalObj = {
    English: 'procedureDescEn',
    Norwegian: 'procedureDescNb',
    Danish: 'procedureDescDa',
    Swedish: 'procedureDescSv',
  };
  const shouldRenderProcedureError = countryData.some((c) => {
    const lang = hospitalObj[c.language] as HospitalProcedureFormSchemaType;
    return errors[lang] && errors[lang]?.message;
  });
  const onFormSubmit: SubmitHandler<EditHospitalProcedureFormFields> = (
    data: EditHospitalProcedureFormFields,
  ) => {
    editHospitalProcedure.mutate({
      waitingTime: data.waitingTime,
      stayInHospital: data.stayInHospital,
      stayInCity: data.stayInCity,
      description: {
        en: data.procedureDescEn,
        da: data.procedureDescDa,
        nb: data.procedureDescNb,
        sv: data.procedureDescSv,
      },
      cost: {
        en: data.costEn,
        da: data.costDa,
        nb: data.costNb,
        sv: data.costSv,
      },
      hospitalProcedureId: params.procedureId,
    });
  };
  React.useEffect(() => {
    if (
      params.procedureId &&
      hospitalProcedureDetails.isSuccess &&
      hospitalProcedureDetails.data &&
      hospitalProcedureDetails.data.success
    ) {
      setValue(
        'departmentName',
        hospitalProcedureDetails.data.data.procedure.category.name.en,
      );
      setValue(
        'procedureName',
        hospitalProcedureDetails.data.data.procedure.name.en,
      );
      setValue(
        'procedureDescEn',
        hospitalProcedureDetails.data.data.description.en,
      );
      setValue(
        'procedureDescNb',
        hospitalProcedureDetails.data.data.description.nb,
      );
      setValue(
        'procedureDescDa',
        hospitalProcedureDetails.data.data.description.da,
      );
      setValue(
        'procedureDescSv',
        hospitalProcedureDetails.data.data.description.sv,
      );
      setValue('costEn', hospitalProcedureDetails.data.data.cost.en);
      setValue('costNb', hospitalProcedureDetails.data.data.cost.nb);
      setValue('costDa', hospitalProcedureDetails.data.data.cost.da);
      setValue('costSv', hospitalProcedureDetails.data.data.cost.sv);
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
  // React.useEffect(() => {
  //   if (editHospital.isSuccess && editHospital.data && editHospital.data.data) {
  //     const logo = getValues('logo');
  //     if (logo) {
  //       const formData = new FormData();
  //       formData.append('logo', logo as Blob);
  //       updateHospitalLogo.mutate({
  //         hospitalId: `${editHospital.data.data}`,
  //         formData,
  //       });
  //     }
  //     const gallery = getValues('gallery');
  //     if (gallery) {
  //       const formData = new FormData();
  //       formData.append('gallery', gallery as Blob);
  //       updateHospitalGallery.mutate({
  //         hospitalId: `${editHospital.data.data}`,
  //         formData,
  //       });
  //     }
  //     router.push(`/hospitals/add/${editHospital.data.data}`);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   editHospital.data,
  //   editHospital.isSuccess,
  //   // getValues,
  //   // updateHospitalLogo,
  //   // updateHospitalGallery,
  // ]);
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
        <h2 className={addHospitalStyle.title}>Edit procedure</h2>

        <form
          className={addHospitalStyle.hospitalProfileForm}
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <label
            style={{ margin: '24px 0 8px' }}
            className={addHospitalStyle.label}
            htmlFor="deparment-sub-category"
          >
            Department/Sub-category
          </label>
          <input
            className={addHospitalStyle.input}
            style={{ backgroundColor: 'rgba(224, 228, 235, 1)' }}
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
          <label
            style={{ margin: '24px 0 8px' }}
            className={addHospitalStyle.label}
            htmlFor="procedure"
          >
            Procedure
          </label>
          <input
            className={addHospitalStyle.input}
            style={{ backgroundColor: 'rgba(224, 228, 235, 1)' }}
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

          <label
            style={{ margin: '32px 0 0' }}
            className={addHospitalStyle.label}
            htmlFor="hospital-procedure-description"
          >
            Procedure Description
          </label>

          <div className={addHospitalStyle.langTabContainer}>
            {countryData.map((data) => {
              const lang = hospitalObj[
                data.language
              ] as HospitalProcedureFormSchemaType;
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
            const lang = hospitalObj[
              c.language
            ] as HospitalProcedureFormSchemaType;
            return (
              <div key={c.countryCode}>
                {c.language === activeLanguageTab && (
                  <textarea
                    className={addHospitalStyle.textarea}
                    placeholder="Type here"
                    id="hospital-procedure-description"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="my-4 flex w-full flex-col items-start">
              <label
                style={{ margin: '32px 0 0' }}
                className={addHospitalStyle.label}
                htmlFor="cost-of-procedure"
              >
                Expected cost of procedure
              </label>

              <div className={addHospitalStyle.langTabContainer}>
                {countryData.map((data) => {
                  const lang = hospitalObj[
                    data.language
                  ] as HospitalProcedureFormSchemaType;
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
                const lang = hospitalObj[
                  c.language
                ] as HospitalProcedureFormSchemaType;
                return (
                  <div key={c.countryCode} className="w-full">
                    {c.language === activeLanguageTab && (
                      <input
                        className={addHospitalStyle.input}
                        placeholder="Type here"
                        id="cost-of-procedure"
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
            <div className="my-4 flex w-full flex-col items-start">
              <label
                style={{ marginBottom: '8px' }}
                className={addHospitalStyle.label}
                htmlFor="waiting-time"
              >
                Expected waiting time for the procedure in days
              </label>
              <input
                style={{ marginBottom: '32px' }}
                className={addHospitalStyle.input}
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
                style={{ marginBottom: '8px' }}
                className={addHospitalStyle.label}
                htmlFor="stay-in-hospital"
              >
                Expected length of stay in the hospital in days
              </label>
              <input
                style={{ marginBottom: '32px' }}
                className={addHospitalStyle.input}
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
                style={{ marginBottom: '8px' }}
                className={addHospitalStyle.label}
                htmlFor="stay-in-city"
              >
                Expected length of stay in the city in days
              </label>
              <input
                style={{ marginBottom: '32px' }}
                className={addHospitalStyle.input}
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

          {/* <h3 className={addHospitalStyle.subTitleHospitalGallery}>
            Procedure related images
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
          )} */}
          <div className={addHospitalStyle.footerBtnContainer}>
            <button className={addHospitalStyle.cancelBtn} type="submit">
              <p>Cancel</p>
            </button>
            <button className={addHospitalStyle.publishBtn} type="submit">
              {editHospitalProcedure.isPending ? (
                <ClipLoader
                  loading={editHospitalProcedure.isPending}
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

export default WithAuth(EditHospitalProcedure);
