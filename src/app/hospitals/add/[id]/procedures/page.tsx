'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { CustomHomePage, Header, PatientsTable, WithAuth } from '@/components';
import { useGetProcedureByHospitalId } from '@/hooks';
import plusIcon from '@/public/assets/icons/plus.svg';

// const CustomStatusEditComponent = (props: CustomCellRendererProps) => {
//   // const [showBtn, setShowBtn] = React.useState(true);
//   const router = useRouter();

//   // const handleClickInfoLink = () => {
//   //   const patientBookingId = props.data['Hospital id'];
//   //   router.push(`/hospitals/add/${patientBookingId}`);
//   // };
// };

function HospitalProcedureManagement() {
  const pathname = usePathname();
  const hospitalId = pathname.split('/')[3];
  const procedureByHospitalId = useGetProcedureByHospitalId({
    id: hospitalId ?? '',
  });
  const router = useRouter();
  return (
    <div>
      <Header />
      <CustomHomePage
        heading="Hospitals"
        subHeading="List of all hospitals listed on the platform"
      >
        {procedureByHospitalId.isSuccess &&
        procedureByHospitalId.data.data &&
        Array(procedureByHospitalId.data.data) &&
        procedureByHospitalId.data.data.length > 0 ? (
          <PatientsTable
            rowData={procedureByHospitalId.data.data.map((r) => ({
              name: r.id,
              department: r.description.en,
              wait_time: r.waitingTime,
            }))}
            colDefs={[
              {
                headerName: 'Procedure /Procedure + sub-category',
                field: 'name',
                filter: true,
                floatingFilter: true,
                flex: 1,
              },
              {
                headerName: 'Department',
                field: 'department',
                filter: true,
                floatingFilter: true,
                flex: 1,
              },
              {
                headerName: 'Wait time',
                field: 'wait_time',
                filter: true,
                floatingFilter: true,
                flex: 1,
              },
              {
                field: '',
                flex: 1,
                // cellRenderer: CustomStatusEditComponent,
              },
            ]}
          />
        ) : (
          <div
            style={{ boxShadow: '2px 2px 4px 1px rgba(9, 111, 144, 0.1)' }}
            className="box-border flex w-full flex-col items-center gap-12 rounded-xl border border-lightskyblue bg-neutral-7 px-[178px] py-12"
          >
            <h2 className="text-center font-poppins text-4xl font-medium text-neutral-1">
              No procedures have been added yet!
            </h2>
            <button
              type="button"
              className="flex h-16 items-center gap-3 rounded-lg bg-darkteal px-6 py-[14px]"
              onClick={() => router.push('/hospitals/add')}
            >
              <Image src={plusIcon} alt="cta btn text" width={25} height={25} />
              <p className="font-poppins text-2xl font-normal text-primary-6">
                Add procedures
              </p>
            </button>
          </div>
        )}
      </CustomHomePage>
    </div>
  );
}

export default WithAuth(HospitalProcedureManagement);
