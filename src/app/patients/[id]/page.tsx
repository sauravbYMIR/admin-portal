'use client';

import { useRouter } from 'next/navigation';

import { BackArrowIcon, Header, WithAuth } from '@/components';
import ArticleSkeleton from '@/components/SkeletonLoader/ArticleSkeleton';
import { useGetBookingDetail } from '@/hooks/useBooking';
import {
  availableCountriesByCountryCode,
  convertToValidCurrency,
} from '@/utils/global';

import patientBookingStyle from './patientBooking.module.scss';

const PatientBooking = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const bookingDetail = useGetBookingDetail({ bookingId: params.id });
  const patientBookingAdditionalData =
    bookingDetail.isSuccess &&
    bookingDetail.data.data &&
    bookingDetail.data.data.id
      ? [
          {
            label: 'Procedure',
            value: bookingDetail.data.data.procedureName.en,
          },
          {
            label: 'Patients preferred dates',
            value: `${bookingDetail.data.data.patientPreferredStartDate} - ${bookingDetail.data.data.patientPreferredEndDate}`,
          },
          {
            label: 'Application status',
            value: bookingDetail.data.data.applicationStatus,
          },
          {
            label: 'Hospital name',
            value: bookingDetail.data.data.hospitalName,
          },
          {
            label: 'Hospital stay',
            value: bookingDetail.data.data.hospitalStay,
          },
          { label: 'Estimated wait', value: bookingDetail.data.data.waitTime },
          {
            label: 'Cost of procedure',
            value: convertToValidCurrency({
              price: bookingDetail.data.data.costOfProcedure.price,
              locale: bookingDetail.data.data.preferredLanguage,
              currency: bookingDetail.data.data.costOfProcedure.currency,
            }),
          },
          {
            label: 'Reimbursement offered',
            value: convertToValidCurrency({
              price:
                bookingDetail.data.data.reimbursementCost[
                  bookingDetail.data.data
                    .claimCountry as keyof typeof bookingDetail.data.data.reimbursementCost
                ],
              currency:
                availableCountriesByCountryCode[
                  bookingDetail.data.data
                    .claimCountry as keyof typeof availableCountriesByCountryCode
                ].currency,
              locale:
                availableCountriesByCountryCode[
                  bookingDetail.data.data
                    .claimCountry as keyof typeof availableCountriesByCountryCode
                ].locale,
            }),
          },
        ]
      : [
          { label: 'Procedure', value: '...' },
          {
            label: '...',
            value: '...',
          },
          { label: 'Application status', value: '...' },
          { label: 'Hospital name', value: '...' },
          { label: 'Hospital stay', value: '...' },
          { label: 'Estimated wait', value: '...' },
          { label: 'Cost of procedure', value: '...' },
          { label: 'Reimbursement offered', value: '...' },
        ];
  const patientBookingData =
    bookingDetail.isSuccess &&
    bookingDetail.data.data &&
    bookingDetail.data.data.id
      ? [
          {
            label: 'Patient name',
            value: `${bookingDetail.data.data.user.firstName} ${bookingDetail.data.data.user.lastName}`,
          },
          { label: 'Gender', value: bookingDetail.data.data.gender },
          {
            label: 'Country of claim ',
            value:
              availableCountriesByCountryCode[
                bookingDetail.data.data
                  .claimCountry as keyof typeof availableCountriesByCountryCode
              ].name,
          },
          {
            label: 'Preferred language',
            value: bookingDetail.data.data.preferredLanguage,
          },
          {
            label: 'Application date',
            value: bookingDetail.data.data.applicationDate,
          },
        ]
      : [
          { label: 'Patient name', value: '...' },
          { label: 'Gender', value: '...' },
          { label: 'Country of claim ', value: '...' },
          { label: 'Preferred language', value: '..' },
          { label: 'Application date', value: '...' },
        ];
  return (
    <div>
      <Header />
      {bookingDetail.isSuccess &&
      bookingDetail.data.data &&
      bookingDetail.data.data.id ? (
        <div className={patientBookingStyle.patientBookingContentContainer}>
          <div className="mb-20 flex items-center gap-x-14">
            <button
              type="button"
              onClick={() => router.push('/patients')}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border-none bg-rgba244"
            >
              <BackArrowIcon strokeWidth="2" stroke="rgba(17, 17, 17, 0.8)" />
              <p className="hidden">text</p>
            </button>
            <h2 className="font-poppins text-3xl font-medium text-darkslategray">
              Booking details
            </h2>
          </div>

          <div className="px-20">
            <div className={patientBookingStyle.firstSectionContentContainer}>
              <div className={patientBookingStyle.patientTagContainer}>
                <p className={patientBookingStyle.patientIdTag}>
                  Electronic ID verified
                </p>

                <p className={patientBookingStyle.patientStatusTag}>
                  {bookingDetail.data.data.applicationStatus}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {patientBookingData.map((data) => {
                  return (
                    <div
                      className={patientBookingStyle.patientInfoContainer}
                      key={data.label}
                    >
                      <p className="font-lexend text-sm font-light text-neutral-2">
                        {data.label}
                      </p>
                      <p className="font-poppins text-base font-medium text-black">
                        {data.label === 'Application date'
                          ? `${new Date(data.value).getDate()}/${new Date(data.value).getMonth()}/${new Date(data.value).getFullYear()}`
                          : data.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-16 grid w-4/5 grid-cols-2 gap-y-16">
              {patientBookingAdditionalData.map((data) => {
                return (
                  <div key={data.label}>
                    <p className="font-lexend text-sm font-light text-neutral-2">
                      {' '}
                      {data.label}{' '}
                    </p>
                    <p className="font-poppins text-base font-medium text-black">
                      {' '}
                      {data.value}{' '}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-screen items-start justify-center">
          <ArticleSkeleton />
        </div>
      )}
    </div>
  );
};

export default WithAuth(PatientBooking);
