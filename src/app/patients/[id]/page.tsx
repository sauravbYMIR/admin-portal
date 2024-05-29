'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Header, WithAuth } from '@/components';
import { useGetBookingDetail } from '@/hooks/useBooking';
import backArrow from '@/public/assets/icons/backArrow.svg';

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
            value: bookingDetail.data.data.costOfProcedure.ie,
          },
          {
            label: 'Reimbursement offered',
            value: bookingDetail.data.data.reimbursementCost.ie,
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
          { label: 'Patient name', value: 'John Doe' },
          { label: 'Gender', value: bookingDetail.data.data.gender },
          {
            label: 'Country of claim ',
            value: bookingDetail.data.data.claimCountry,
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
          <button
            type="button"
            className="cursor-pointer border-none bg-transparent"
            onClick={() => router.push('/patients')}
          >
            <Image
              className={patientBookingStyle.backIcon}
              src={backArrow}
              alt="back arrow"
            />
          </button>

          <h2 className={patientBookingStyle.title}>Booking details</h2>

          <div className={patientBookingStyle.firstSectionContentContainer}>
            <div className={patientBookingStyle.patientTagContainer}>
              <p className={patientBookingStyle.patientIdTag}>
                Electronic ID verified
              </p>

              <p className={patientBookingStyle.patientStatusTag}>
                {bookingDetail.data.data.applicationStatus}
              </p>
            </div>

            <div className={patientBookingStyle.patientsInfoContainer}>
              {patientBookingData.map((data) => {
                return (
                  <div
                    className={patientBookingStyle.patientInfoContainer}
                    key={data.label}
                  >
                    <p className={patientBookingStyle.infoLabel}>
                      {data.label}
                    </p>
                    <p className={patientBookingStyle.infoValue}>
                      {data.label === 'Application date'
                        ? `${new Date(data.value).getDate()}/${new Date(data.value).getMonth()}/${new Date(data.value).getFullYear()}`
                        : data.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={patientBookingStyle.secondSectionContentContainer}>
            {patientBookingAdditionalData.map((data) => {
              return (
                <div
                  className={patientBookingStyle.patientInfoContainer}
                  key={data.label}
                >
                  <p className={patientBookingStyle.infoLabel}>
                    {' '}
                    {data.label}{' '}
                  </p>
                  <p className={patientBookingStyle.infoValue}>
                    {' '}
                    {data.value}{' '}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>loading...</>
      )}
    </div>
  );
};

export default WithAuth(PatientBooking);
