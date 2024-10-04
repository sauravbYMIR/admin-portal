'use client';

import type { CustomCellRendererProps } from 'ag-grid-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';

import { DataTable, Header, WithAuth } from '@/components';
import ShowDataTable from '@/components/Table/PatientsTable/PatientsTable';
import { useGetAllBookings, useUpdateBookingStatus } from '@/hooks/useBooking';
import emptyState from '@/public/assets/images/emptyState.svg';
import { ACCEPT, ACCEPTED, REJECT, REJECTED, REQUESTED } from '@/utils/global';

import patientsStyle from './patients.module.scss';

const EmptyBookingsPage = () => {
  return (
    <div className="mt-[100px] flex w-screen flex-col items-center justify-center">
      <Image
        src={emptyState}
        alt="empty-procedure-list"
        width={160}
        height={160}
      />
      <p className="mb-7 mt-3 font-poppins text-base font-normal text-neutral-2">
        No bookings have been created yet!
      </p>
    </div>
  );
};

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
    <div className="flex items-center gap-x-8">
      {props.data.status === REQUESTED && (
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
      <button
        type="button"
        className="cursor-pointer border-none underline decoration-darkteal decoration-2 underline-offset-[5px]"
        onClick={handleClickInfoLink}
      >
        <span className="text-darkteal">View</span>
      </button>
    </div>
  );
};
function PatientsPage() {
  const allBookings = useGetAllBookings();
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
        allBookings.data.data.length > 0 ? (
          <ShowDataTable
            rowData={allBookings.data.data.map((r) => ({
              procedure: r.procedureName.en,
              hospital: r.hospitalName,
              status:
                r.applicationStatus.charAt(0).toUpperCase() +
                r.applicationStatus.slice(1),
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
              },
              {
                headerName: 'Hospital',
                field: 'hospital',
                filter: true,
                floatingFilter: true,
                flex: 1,
              },
              {
                headerName: 'Status',
                field: 'status',
                filter: true,
                floatingFilter: true,
                flex: 1,
                editable: true,
                cellStyle: (params: { data: { status: string } }) => {
                  switch (params.data.status) {
                    case REQUESTED:
                      return {
                        color: 'rgba(220, 104, 3, 1)',
                        backgroundColor: 'rgba(254, 240, 199, 1)',
                      };
                    case ACCEPTED:
                      return {
                        color: 'rgba(0, 59, 212, 1)',
                        backgroundColor: 'rgba(230, 237, 255, 1)',
                      };
                    case REJECTED:
                      return {
                        color: 'rgba(144, 0, 18, 1)',
                        backgroundColor: 'rgba(253, 237, 237, 1)',
                      };
                    default:
                      break;
                  }
                  return null;
                },
              },
              {
                field: '',
                flex: 1,
                cellRenderer: CustomStatusEditComponent,
              },
            ]}
          />
        ) : (
          <div>
            {allBookings.isPending ? <DataTable /> : <EmptyBookingsPage />}
          </div>
        )}
      </div>
    </div>
  );
}

export default WithAuth(PatientsPage);
