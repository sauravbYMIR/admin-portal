'use client';

import type { CustomCellRendererProps } from 'ag-grid-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import {
  CustomHomePage,
  DataTable,
  Header,
  PlusIcon,
  WithAuth,
} from '@/components';
import ShowDataTable from '@/components/Table/PatientsTable/PatientsTable';
import { useGetAllHospital } from '@/hooks';
import infoLinkIcon from '@/public/assets/icons/linkArrow.svg';
import plusIcon from '@/public/assets/icons/plus.svg';
import emptyHospital from '@/public/assets/images/emptyHospital.svg';

import patientsTableStyle from '../../components/Table/PatientsTable/patientsTable.module.scss';

const EmptyHospitalPage = () => {
  const router = useRouter();
  return (
    <div className="mt-[100px] flex w-screen flex-col items-center justify-center">
      <Image
        src={emptyHospital}
        alt="empty-hospital-list"
        width={160}
        height={160}
      />
      <p className="mb-7 mt-3 font-poppins text-base font-normal text-neutral-2">
        No hospitals have been added yet!
      </p>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-3 rounded-lg bg-darkteal px-6 py-[14px]"
        onClick={() => router.push('/hospitals/add')}
      >
        <PlusIcon className="size-5" stroke="#fff" />
        <p className="font-poppins text-base font-semibold text-primary-6">
          Add a hospital
        </p>
      </button>
    </div>
  );
};

const CustomStatusEditComponent = (props: CustomCellRendererProps) => {
  const router = useRouter();
  const handleClickInfoLink = () => {
    const hospitalId = props.data.hospital_id;
    router.push(`/hospitals/add/${hospitalId}`);
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
  // const onCellClicked = async (params: any) => {
  //   if (params.type === 'cellEditingStopped') {
  //     try {
  //       const r = await editHospital({
  //         name: params.data.hospital_name,
  //         description: {
  //           en: params.data.description.en,
  //           sv: params.data.description.sv,
  //           da: params.data.description.da,
  //           nb: params.data.description.nb,
  //         },
  //         streetName: params.data.streetName,
  //         streetNumber: params.data.streetNumber,
  //         city: params.data.city,
  //         country: params.data.location,
  //         zipcode: params.data.zipCode,
  //         hospitalId: params.data.hospital_id,
  //       });
  //       if (r.success) {
  //         toast.success('Changes updated successfully');
  //       }
  //     } catch (e) {
  //       toast.error('error while updated hospital procedure');
  //     }
  //   }
  // };
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
          <div className="flex flex-col items-start">
            <button
              type="button"
              className="mb-5 flex items-center justify-between rounded-[6.4px] bg-darkteal px-6 py-3 text-white"
              onClick={() => router.push(`/hospitals/add/`)}
            >
              <Image src={plusIcon} alt="cta btn text" width={25} height={25} />
              <p className="font-poppins text-base font-medium">
                Add new hospital
              </p>
            </button>

            {hospitals.isLoading ? (
              <DataTable />
            ) : (
              <ShowDataTable
                // onCellClicked={onCellClicked}
                rowData={hospitals.data.data.map((r) => ({
                  name: r.name,
                  description: r.description,
                  streetName: r.streetName,
                  streetNumber: r.streetNumber,
                  city: r.city,
                  zipCode: r.zipcode,
                  hospital_id: r.id,
                  hospital_name: r.name,
                  location: r.country,
                }))}
                colDefs={[
                  {
                    headerName: 'Hospital id',
                    field: 'hospital_id',
                    filter: true,
                    floatingFilter: true,
                    flex: 1,
                  },
                  {
                    headerName: 'Hospital name',
                    field: 'hospital_name',
                    filter: true,
                    floatingFilter: true,
                    flex: 1,
                  },
                  {
                    headerName: 'Location',
                    field: 'location',
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
            )}
          </div>
        ) : (
          <div>
            {hospitals.isLoading ? <DataTable /> : <EmptyHospitalPage />}
          </div>
        )}
      </CustomHomePage>
    </div>
  );
}

export default WithAuth(HospitalsPage);
