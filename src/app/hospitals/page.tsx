'use client';

import type { CustomCellRendererProps } from 'ag-grid-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { CustomHomePage, Header, PatientsTable, WithAuth } from '@/components';
import { useGetAllHospital } from '@/hooks';
import infoLinkIcon from '@/public/assets/icons/linkArrow.svg';
import plusIcon from '@/public/assets/icons/plus.svg';

import patientsTableStyle from '../../components/Table/PatientsTable/patientsTable.module.scss';

const CustomStatusEditComponent = (props: CustomCellRendererProps) => {
  // const [showBtn, setShowBtn] = React.useState(true);
  const router = useRouter();

  const handleClickInfoLink = () => {
    const patientBookingId = props.data['Hospital id'];
    router.push(`/hospitals/add/${patientBookingId}`);
  };

  return (
    <div className={patientsTableStyle.patientsTableBtnContainer}>
      <Image
        className={patientsTableStyle.patientsTableInfoLink}
        src={infoLinkIcon}
        alt="patients table info link arrow icon"
        onClick={handleClickInfoLink}
      />
    </div>
  );
};

function HospitalsPage() {
  const router = useRouter();
  const hospitals = useGetAllHospital();
  return (
    <div>
      <Header />
      <CustomHomePage
        heading="Hospitals"
        subHeading="List of all hospitals listed on the platform"
      >
        {hospitals.isSuccess &&
        hospitals.data.data &&
        Array(hospitals.data.data) &&
        hospitals.data.data.length > 0 ? (
          <PatientsTable
            rowData={hospitals.data.data.map((r) => ({
              'Hospital id': r.id,
              'Hospital name': r.name,
              Location: r.country,
            }))}
            colDefs={[
              {
                headerName: 'ABC',
                field: 'Hospital id',
                filter: true,
                floatingFilter: true,
                flex: 1,
              },
              {
                field: 'Hospital name',
                filter: true,
                floatingFilter: true,
                flex: 1,
              },
              {
                field: 'Location',
                filter: true,
                floatingFilter: true,
                flex: 1,
              },
              {
                field: '',
                flex: 1,
                cellRenderer: CustomStatusEditComponent,
              },
            ]}
          />
        ) : (
          <div
            style={{ boxShadow: '2px 2px 4px 1px rgba(9, 111, 144, 0.1)' }}
            className="box-border flex w-full flex-col items-center gap-12 rounded-xl border border-lightskyblue bg-neutral-7 px-[178px] py-12"
          >
            <h2 className="text-center font-poppins text-4xl font-medium text-neutral-1">
              No hospitals have been add yet!
            </h2>
            <button
              type="button"
              className="flex h-16 items-center gap-3 rounded-lg bg-darkteal px-6 py-[14px]"
              onClick={() => router.push('/hospitals/add')}
            >
              <Image src={plusIcon} alt="cta btn text" width={25} height={25} />
              <p className="font-poppins text-2xl font-normal text-primary-6">
                Add a hospital
              </p>
            </button>
          </div>
        )}
      </CustomHomePage>
    </div>
  );
}

export default WithAuth(HospitalsPage);
