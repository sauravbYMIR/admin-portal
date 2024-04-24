'use client';

import type { CustomCellRendererProps } from 'ag-grid-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { CustomHomePage, Header, PatientsTable, WithAuth } from '@/components';
import {
  editHospitalProcedure,
  useGetAllHospitalProcedure,
} from '@/hooks/useHospitalProcedure';
import infoLinkIcon from '@/public/assets/icons/linkArrow.svg';
import plusIcon from '@/public/assets/icons/plus.svg';

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

function HospitalProcedureManagement() {
  const pathname = usePathname();
  const hospitalId = pathname.split('/')[3];
  const procedureByHospitalId = useGetAllHospitalProcedure({
    id: hospitalId ?? '',
  });
  const router = useRouter();
  const onCellClicked = async (params: any) => {
    if (params.type === 'cellEditingStopped') {
      try {
        const r = await editHospitalProcedure({
          waitingTime: params.data.waitTime,
          stayInHospital: params.data.stayInHospital,
          stayInCity: params.data.stayInCity,
          description: params.data.desc,
          cost: {
            ...params.data.costObj,
            en: params.data.cost,
          },
          hospitalProcedureId: params.data.id,
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
          <PatientsTable
            onCellClicked={onCellClicked}
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
