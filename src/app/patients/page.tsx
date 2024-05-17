'use client';

import type { CustomCellRendererProps } from 'ag-grid-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';

import { Header, PatientsTable, WithAuth } from '@/components';
import { useGetAllBookings, useUpdateBookingStatus } from '@/hooks/useBooking';
import infoLinkIcon from '@/public/assets/icons/linkArrow.svg';

import patientsTableStyle from '../../components/Table/PatientsTable/patientsTable.module.scss';
import patientsStyle from './patients.module.scss';

const CustomStatusEditComponent = (props: CustomCellRendererProps) => {
  const router = useRouter();
  const [loadingType, setLoadingType] = React.useState<string>('NONE');
  const { bookingId } = props.data;
  const handleClickInfoLink = () => {
    router.push(`/patients/${bookingId}`);
  };
  const updateBookingStatus = useUpdateBookingStatus();
  React.useEffect(() => {
    if (updateBookingStatus.isSuccess) {
      setLoadingType('NONE');
      toast.success('Application status updated successfully');
    }
  }, [updateBookingStatus.isSuccess]);
  return (
    <div className={patientsTableStyle.patientsTableBtnContainer}>
      {props.data.status === 'pending' && (
        <>
          <button
            type="button"
            className={patientsTableStyle.patientsTableAcceptBtn}
            onClick={() => {
              setLoadingType('ACCEPT');
              updateBookingStatus.mutate({
                bookingId,
                status: true,
                userId: props.data.userId ?? '',
              });
            }}
          >
            {loadingType === 'ACCEPT' && updateBookingStatus.isPending ? (
              <ClipLoader
                loading={updateBookingStatus.isPending}
                color="#fff"
                size={13}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <span>Accept</span>
            )}
          </button>
          <button
            type="button"
            className={patientsTableStyle.patientsTableRejectBtn}
            onClick={() => {
              setLoadingType('REJECT');
              updateBookingStatus.mutate({
                bookingId,
                status: false,
                userId: props.data.userId ?? '',
              });
            }}
          >
            {loadingType === 'REJECT' && updateBookingStatus.isPending ? (
              <ClipLoader
                loading={updateBookingStatus.isPending}
                color="rgba(9, 111, 144, 1)"
                size={13}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              <span>Reject</span>
            )}
          </button>
        </>
      )}
      <Image
        className={patientsTableStyle.patientsTableInfoLink}
        src={infoLinkIcon}
        alt="patients table info link arrow icon"
        onClick={handleClickInfoLink}
      />
    </div>
  );
};
function PatientsPage() {
  const allBookings = useGetAllBookings();
  // const onCellClicked = async (params: any) => {
  //   // if (params.type === 'cellEditingStopped') {
  //   //   try {
  //   //     const r = await editHospital({
  //   //       name: params.data.hospital_name,
  //   //       description: {
  //   //         en: params.data.description.en,
  //   //         sv: params.data.description.sv,
  //   //         da: params.data.description.da,
  //   //         nb: params.data.description.nb,
  //   //       },
  //   //       streetName: params.data.streetName,
  //   //       streetNumber: params.data.streetNumber,
  //   //       city: params.data.city,
  //   //       country: params.data.location,
  //   //       zipcode: params.data.zipCode,
  //   //       hospitalId: params.data.hospital_id,
  //   //     });
  //   //     if (r.success) {
  //   //       toast.success('Changes updated successfully');
  //   //     }
  //   //   } catch (e) {
  //   //     toast.error('error while updated hospital procedure');
  //   //   }
  //   // }
  // };
  return (
    <div>
      <Header />

      <div className={patientsStyle.patientsPageContentContainer}>
        <h2 className={patientsStyle.patientsPageTitle}>Our patients</h2>
        <p className={patientsStyle.patientsPageDesc}>
          List of all of our bookings
        </p>

        {allBookings &&
          allBookings.data &&
          allBookings.data.data &&
          Array.isArray(allBookings.data.data) &&
          allBookings.data.data.length > 0 && (
            <PatientsTable
              // onCellClicked={onCellClicked}
              rowData={allBookings.data.data.map((r) => ({
                procedure: r.procedureName.en,
                hospital: r.hospitalName,
                status: r.applicationStatus,
                bookingId: r.id,
                userId: r.userId,
              }))}
              colDefs={[
                {
                  headerName: 'Procedure',
                  field: 'procedure',
                  filter: true,
                  floatingFilter: true,
                  flex: 1,
                  editable: true,
                },
                {
                  headerName: 'Hospital',
                  field: 'hospital',
                  filter: true,
                  floatingFilter: true,
                  flex: 1,
                  editable: true,
                },
                {
                  headerName: 'Status',
                  field: 'status',
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
    </div>
  );
}

export default WithAuth(PatientsPage);
