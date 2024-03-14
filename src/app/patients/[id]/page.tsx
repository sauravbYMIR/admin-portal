'use client';

import Image from 'next/image';

import { Header } from '@/components';
import backArrow from '@/public/assets/icons/backArrow.svg';

import patientBookingStyle from './patientBooking.module.scss';

const patientBookingData = [
  { label: 'Patient name', value: 'Ethan Fender' },
  { label: 'Gender', value: 'Male' },
  { label: 'Country of claim ', value: 'Ireland' },
  { label: 'Preferred language', value: 'English' },
  { label: 'Application date', value: '24/Jun/2024' },
];

const patientBookingAdditionalData = [
  { label: 'Procedure', value: 'Hip replacement' },
  { label: 'Patients preferred dates', value: '24/Jun/2024 - 24/July/2024' },
  { label: 'Application status', value: 'Request rejected' },
  { label: 'Hospital name', value: 'PSH Hospital, Norway' },
  { label: 'Hospital stay', value: '12 Days' },
  { label: 'Estimated wait', value: '3 - 4 weeks' },
  { label: 'Cost of procedure', value: '1,000,000 euros' },
  { label: 'Reimbursement offered', value: '800,000 euros' },
];

function PatientBooking({ params }: { params: { id: string } }) {
  console.log(params.id);

  return (
    <div>
      <Header />

      <div className={patientBookingStyle.patientBookingContentContainer}>
        <Image
          className={patientBookingStyle.backIcon}
          src={backArrow}
          alt="back arrow"
        />

        <h2 className={patientBookingStyle.title}>Booking details</h2>

        <div className={patientBookingStyle.firstSectionContentContainer}>
          <div className={patientBookingStyle.patientTagContainer}>
            <p className={patientBookingStyle.patientIdTag}>
              Electronic ID verified
            </p>

            <p className={patientBookingStyle.patientStatusTag}>Rejected</p>
          </div>

          <div className={patientBookingStyle.patientsInfoContainer}>
            {patientBookingData.map((data) => {
              return (
                <div
                  className={patientBookingStyle.patientInfoContainer}
                  key={data.label}
                >
                  <p className={patientBookingStyle.infoLabel}>{data.label}</p>
                  <p className={patientBookingStyle.infoValue}>{data.value}</p>
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
                <p className={patientBookingStyle.infoLabel}> {data.label} </p>
                <p className={patientBookingStyle.infoValue}> {data.value} </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PatientBooking;
