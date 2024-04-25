/* eslint-disable import/no-extraneous-dependencies */

'use client';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './table.css';

import { AgGridReact } from 'ag-grid-react';

function PatientsTable<T extends {}, U extends {}>({
  rowData,
  colDefs,
  onCellClicked,
}: {
  rowData: Array<T>;
  colDefs: Array<U>;
  onCellClicked?: (params: any) => void;
}): JSX.Element {
  return (
    <div className="ag-theme-quartz" style={{ width: '100%', height: '408px' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        pagination
        paginationAutoPageSize
        cacheBlockSize={20}
        onCellEditingStopped={onCellClicked}
      />
    </div>
  );
}

export default PatientsTable;
