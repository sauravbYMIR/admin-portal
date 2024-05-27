'use client';

import type { CustomCellRendererProps } from 'ag-grid-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  CustomHomePage,
  DataTable,
  Header,
  PlusIcon,
  WithAuth,
} from '@/components';
import ShowDataTable from '@/components/Table/PatientsTable/PatientsTable';
import { useGetAllHospitalProcedure } from '@/hooks/useHospitalProcedure';
import infoLinkIcon from '@/public/assets/icons/linkArrow.svg';
import plusIcon from '@/public/assets/icons/plus.svg';
import emptyState from '@/public/assets/images/emptyState.svg';

import patientsTableStyle from '../../../../../components/Table/PatientsTable/patientsTable.module.scss';

const CustomStatusEditComponent = (props: CustomCellRendererProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const handleClickInfoLink = () => {
    const procedureId = props.data.id;
    const hospitalId = pathname.split('/')[3];
    router.push(`/hospitals/add/${hospitalId}/procedures/${procedureId}`);
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

const EmptyHospitalProcedurePage = ({
  hospitalId,
}: {
  hospitalId?: string;
}) => {
  const router = useRouter();
  return (
    <div className="mt-[100px] flex w-screen flex-col items-center justify-center">
      <Image
        src={emptyState}
        alt="empty-procedure-list"
        width={160}
        height={160}
      />
      <p className="mb-7 mt-3 font-poppins text-base font-normal text-neutral-2">
        No procedures have been added yet!
      </p>
      <button
        type="button"
        className="flex cursor-pointer items-center gap-3 rounded-lg bg-darkteal px-6 py-[14px]"
        onClick={() =>
          router.push(`/hospitals/add/${hospitalId}/procedures/add`)
        }
      >
        <PlusIcon className="size-5" stroke="#fff" />
        <p className="font-poppins text-base font-semibold text-primary-6">
          Add procedures
        </p>
      </button>
    </div>
  );
};

function HospitalProcedureManagement() {
  const pathname = usePathname();
  const hospitalId = pathname.split('/')[3];
  const procedureByHospitalId = useGetAllHospitalProcedure({
    id: hospitalId ?? '',
  });
  const router = useRouter();
  // const onCellClicked = async (params: any) => {
  //   if (params.type === 'cellEditingStopped') {
  //     try {
  //       const r = await editHospitalProcedure({
  //         waitingTime: params.data.waitTime,
  //         stayInHospital: params.data.stayInHospital,
  //         stayInCity: params.data.stayInCity,
  //         description: params.data.desc,
  //         cost: {
  //           ...params.data.costObj,
  //           en: params.data.cost,
  //         },
  //         hospitalProcedureId: params.data.id,
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
        heading="Procedure management"
        subHeading={
          <div className="flex w-[320px] items-center justify-between">
            <Link
              href="/hospitals"
              className="font-lexend text-base font-normal text-neutral-3"
            >
              Hospitals{' '}
            </Link>
            /
            <Link
              href={`/hospitals/add/${hospitalId}`}
              className="font-lexend text-base font-normal text-neutral-3"
            >
              Details{' '}
            </Link>
            /
            <Link
              href={`/hospitals/add/${hospitalId}/procedures/`}
              className="font-lexend text-base font-normal text-darkteal"
            >
              Procedure list
            </Link>
          </div>
        }
      >
        {procedureByHospitalId.isSuccess &&
        procedureByHospitalId.data.data &&
        Array(procedureByHospitalId.data.data) &&
        procedureByHospitalId.data.data.length > 0 ? (
          <div className="flex flex-col items-start justify-between">
            <button
              type="button"
              className="mb-5 flex items-center justify-between rounded-[6.4px] bg-darkteal px-6 py-3 text-white"
              onClick={() =>
                router.push(`/hospitals/add/${hospitalId}/procedures/add`)
              }
            >
              <Image src={plusIcon} alt="cta btn text" width={25} height={25} />
              <p className="font-poppins text-base font-medium">
                Add new procedure
              </p>
            </button>
            {procedureByHospitalId.isLoading ? (
              <DataTable />
            ) : (
              <ShowDataTable
                // onCellClicked={onCellClicked}
                rowData={procedureByHospitalId.data.data.map((r) => ({
                  name: `${r.procedure.name.en}`,
                  department: r.procedure.category.name.en,
                  waitTime: r.waitingTime,
                  cost: r.cost.en,
                  id: r.id,
                  stayInHospital: r.stayInHospital,
                  stayInCity: r.stayInCity,
                  desc: {
                    en: r.description.en,
                    da: r.description.da,
                    sv: r.description.sv,
                    nb: r.description.nb,
                  },
                  costObj: {
                    en: r.cost.en,
                    da: r.cost.da,
                    sv: r.cost.sv,
                    nb: r.cost.nb,
                  },
                }))}
                colDefs={[
                  {
                    headerName: 'Procedure /Procedure + sub-category',
                    field: 'name',
                    filter: true,
                    floatingFilter: true,
                    flex: 1,
                    editable: true,
                  },
                  {
                    headerName: 'Department',
                    field: 'department',
                    filter: true,
                    floatingFilter: true,
                    flex: 1,
                    editable: true,
                  },
                  {
                    headerName: 'Wait time',
                    field: 'waitTime',
                    filter: true,
                    floatingFilter: true,
                    flex: 1,
                    editable: true,
                  },
                  {
                    headerName: 'Cost of procedure',
                    field: 'cost',
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
            {procedureByHospitalId.isLoading ? (
              <DataTable />
            ) : (
              <EmptyHospitalProcedurePage hospitalId={hospitalId} />
            )}
          </div>
        )}
      </CustomHomePage>
    </div>
  );
}

export default WithAuth(HospitalProcedureManagement);
