'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';

import { BackArrowIcon, Header, WithAuth } from '@/components';
import ArticleSkeleton from '@/components/SkeletonLoader/ArticleSkeleton';
import {
  useGetBookingDetail,
  useUpdateBookingStatus,
} from '@/hooks/useBooking';
import {
  ACCEPT,
  ACCEPTED,
  availableCountries,
  availableCountriesByCountryCode,
  convertToValidCurrency,
  REJECT,
  REQUESTED,
} from '@/utils/global';

import patientBookingStyle from './patientBooking.module.scss';

const AdminActionButton = ({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) => {
  const router = useRouter();
  const [loadingType, setLoadingType] = React.useState<string>('NONE');
  const updateBookingStatus = useUpdateBookingStatus();
  React.useEffect(() => {
    if (updateBookingStatus.isSuccess) {
      setLoadingType('NONE');
      toast.success('Application status updated successfully');
      router.push(`/patients`);
    }
  }, [router, updateBookingStatus.isSuccess]);
  return (
    <div className="flex items-center gap-x-8">
      {status.toUpperCase() === REQUESTED.toUpperCase() && (
        <>
          <button
            type="button"
            className="flex h-[41px] w-[90.45px] items-center justify-center rounded-[6.4px] bg-darkteal px-5 py-[10px]"
            onClick={() => {
              setLoadingType(ACCEPT);
              updateBookingStatus.mutate({
                bookingId,
                status: true,
              });
            }}
          >
            {loadingType === ACCEPT && updateBookingStatus.isPending ? (
              <ClipLoader
                loading={updateBookingStatus.isPending}
                color="#fff"
                size={13}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <span className="font-poppins text-sm font-semibold text-white">
                Accept
              </span>
            )}
          </button>
          <button
            type="button"
            className="flex h-[41px] w-[90.45px] items-center justify-center rounded-[6.4px] border-2 border-darkteal px-5 py-[10px]"
            onClick={() => {
              setLoadingType(REJECT);
              updateBookingStatus.mutate({
                bookingId,
                status: false,
              });
            }}
          >
            {loadingType === REJECT && updateBookingStatus.isPending ? (
              <ClipLoader
                loading={updateBookingStatus.isPending}
                color="rgba(9, 111, 144, 1)"
                size={13}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <span className="font-poppins text-sm font-semibold text-darkteal">
                Reject
              </span>
            )}
          </button>
        </>
      )}
    </div>
  );
};

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
            value: `${bookingDetail.data.data.patientPreferredStartDate ? new Date(bookingDetail.data.data.patientPreferredStartDate).toLocaleDateString('en-US') : '----'} to ${bookingDetail.data.data.patientPreferredEndDate ? new Date(bookingDetail.data.data.patientPreferredEndDate).toLocaleDateString('en-US') : '----'}`,
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
                ] ?? 0,
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
            value:
              Object.values(availableCountries).find(
                (data) =>
                  data.locale === bookingDetail.data.data.preferredLanguage,
              )?.language ?? '',
          },
          {
            label: 'Application date',
            value: bookingDetail.data.data.applicationDate
              ? new Date(
                  bookingDetail.data.data.applicationDate,
                ).toLocaleDateString('en-US')
              : '----',
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
          <div className="flex w-full items-start justify-between">
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
            <AdminActionButton
              bookingId={bookingDetail.data.data.id}
              status={bookingDetail.data.data.applicationStatus}
            />
          </div>

          <div className="px-20">
            <div className={patientBookingStyle.firstSectionContentContainer}>
              <div className={patientBookingStyle.patientTagContainer}>
                <p className={patientBookingStyle.patientIdTag}>
                  Electronic ID verified
                </p>

                <div
                  className="flex items-center justify-center rounded-sm px-2 py-1"
                  style={
                    // eslint-disable-next-line no-nested-ternary
                    bookingDetail.data.data.applicationStatus.toUpperCase() ===
                    REQUESTED.toUpperCase()
                      ? {
                          color: 'rgba(220, 104, 3, 1)',
                          backgroundColor: 'rgba(254, 240, 199, 1)',
                        }
                      : bookingDetail.data.data.applicationStatus.toUpperCase() ===
                          ACCEPTED.toUpperCase()
                        ? {
                            color: 'rgba(0, 59, 212, 1)',
                            backgroundColor: 'rgba(230, 237, 255, 1)',
                          }
                        : {
                            color: 'rgba(144, 0, 18, 1)',
                            backgroundColor: 'rgba(253, 237, 237, 1)',
                          }
                  }
                >
                  <span className="text-sm">
                    {bookingDetail.data.data.applicationStatus
                      .charAt(0)
                      .toUpperCase()}
                    {bookingDetail.data.data.applicationStatus.slice(1)}
                  </span>
                </div>
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
                        {data.value}
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
