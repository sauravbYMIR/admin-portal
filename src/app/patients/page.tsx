'use client';

import { Header, WithAuth } from '@/components';

import patientsStyle from './patients.module.scss';

function PatientsPage() {
  return (
    <div>
      <Header />

      <div className={patientsStyle.patientsPageContentContainer}>
        <h2 className={patientsStyle.patientsPageTitle}>Our patients</h2>
        <p className={patientsStyle.patientsPageDesc}>
          List of all of our bookings
        </p>

        {/* <PatientsTable /> */}
      </div>
    </div>
  );
}

export default WithAuth(PatientsPage);
