/* eslint-disable import/no-extraneous-dependencies */

'use client';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { FbtButton } from '@frontbase/components-react';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { AgGridReact } from 'ag-grid-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import infoLinkIcon from '@/public/assets/icons/linkArrow.svg';

import patientsTableStyle from './patientsTable.module.scss';

interface RowData {
  id: string;
  name: string;
  procedure: string;
  hospital: string;
  status: string;
}

const CustomStatusEditComponent = (props: CustomCellRendererProps) => {
  const [showBtn, setShowBtn] = useState(true);
  const router = useRouter();

  const handleClickInfoLink = () => {
    const patientBookingId = props?.data?.id;
    router.push(`/patients/${patientBookingId}`);
  };

  return (
    <div className={patientsTableStyle.patientsTableBtnContainer}>
      {showBtn && (
        <>
          <FbtButton
            className={patientsTableStyle.patientsTableAcceptBtn}
            size="sm"
            variant="solid"
            onClick={() => setShowBtn(false)}
          >
            Accept
          </FbtButton>

          <FbtButton
            className={patientsTableStyle.patientsTableRejectBtn}
            size="sm"
            variant="outline"
            onClick={() => setShowBtn(false)}
          >
            Reject
          </FbtButton>
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

const PatientsTable = () => {
  const [rowData] = useState<RowData[]>([
    {
      id: '1',
      name: 'John Doe',
      procedure: 'Surgery',
      hospital: 'General Hospital',
      status: 'Pending',
    },
    {
      id: '2',
      name: 'Jane Doe',
      procedure: 'Checkup',
      hospital: 'Community Clinic',
      status: 'Accepted',
    },
    {
      id: '3',
      name: 'Alice Smith',
      procedure: 'X-ray',
      hospital: 'Central Hospital',
      status: 'Rejected',
    },
    {
      id: '4',
      name: 'Bob Johnson',
      procedure: 'Cast Removal',
      hospital: 'City Hospital',
      status: 'Accepted',
    },
    {
      id: '5',
      name: 'Mary Williams',
      procedure: 'Blood Test',
      hospital: 'County Clinic',
      status: 'Pending',
    },
    {
      id: '6',
      name: 'David Miller',
      procedure: 'MRI Scan',
      hospital: 'University Hospital',
      status: 'Pending',
    },
    {
      id: '7',
      name: 'Sarah Jones',
      procedure: 'Physical Therapy',
      hospital: 'Rehabilitation Center',
      status: 'Rejected',
    },
    {
      id: '8',
      name: 'Michael Brown',
      procedure: 'Biopsy',
      hospital: 'Cancer Center',
      status: 'Rejected',
    },
  ]);

  const [colDefs] = useState<any>([
    { field: 'name', flex: 1, filter: true, floatingFilter: true },
    { field: 'procedure', flex: 1, filter: true, floatingFilter: true },
    { field: 'hospital', flex: 1, filter: true, floatingFilter: true },
    { field: 'status', flex: 1, filter: true, floatingFilter: true },
    {
      field: '',
      flex: 2,
      cellRenderer: CustomStatusEditComponent,
    },
  ]);

  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <div className="ag-theme-quartz" style={{ height: '500px', width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        // onCellValueChanged={(event) => console.log(event.value, event)}
      />
    </div>
  );
};

export default PatientsTable;
