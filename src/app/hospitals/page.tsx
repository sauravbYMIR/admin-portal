'use client';

import type { CustomCellRendererProps } from 'ag-grid-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import {
  CustomHomePage,
  DataTable,
  Header,
  PatientsTable,
  WithAuth,
} from '@/components';
import { editHospital, useGetAllHospital } from '@/hooks';
import infoLinkIcon from '@/public/assets/icons/linkArrow.svg';
import plusIcon from '@/public/assets/icons/plus.svg';

import patientsTableStyle from '../../components/Table/PatientsTable/patientsTable.module.scss';

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
  const onCellClicked = async (params: any) => {
    if (params.type === 'cellEditingStopped') {
      try {
        const r = await editHospital({
          name: params.data.hospital_name,
          description: {
            en: params.data.description.en,
            sv: params.data.description.sv,
            da: params.data.description.da,
            nb: params.data.description.nb,
          },
          streetName: params.data.streetName,
          streetNumber: params.data.streetNumber,
          city: params.data.city,
          country: params.data.location,
          zipcode: params.data.zipCode,
          hospitalId: params.data.hospital_id,
        });
        if (r.success) {
          toast.success('Changes updated successfully');
        }
      } catch (e) {
        toast.error('error while updated hospital procedure');
      }
    }
  };
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
              <PatientsTable
                onCellClicked={onCellClicked}
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
                    editable: true,
                  },
                  {
                    headerName: 'Hospital name',
                    field: 'hospital_name',
                    filter: true,
                    floatingFilter: true,
                    flex: 1,
                    editable: true,
                  },
                  {
                    headerName: 'Location',
                    field: 'location',
                    filter: true,
                    floatingFilter: true,
                    flex: 1,
                    editable: true,
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
            {hospitals.isLoading ? (
              <DataTable />
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
                  <Image
                    src={plusIcon}
                    alt="cta btn text"
                    width={25}
                    height={25}
                  />
                  <p className="font-poppins text-2xl font-normal text-primary-6">
                    Add a hospital
                  </p>
                </button>
              </div>
            )}
          </div>
        )}
      </CustomHomePage>
    </div>
  );
}

export default WithAuth(HospitalsPage);
