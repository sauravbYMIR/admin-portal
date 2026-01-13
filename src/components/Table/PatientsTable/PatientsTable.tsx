/* eslint-disable import/no-extraneous-dependencies */

'use client';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './table.css';

import { AgGridReact } from 'ag-grid-react';

function ShowDataTable<T extends {}, U extends {}>({
  rowData,
  colDefs,
  onCellClicked,
}: {
  rowData: Array<T>;
  colDefs: Array<U>;
  onCellClicked?: (params: any) => void;
}): JSX.Element {
  return (
    <div
      className="ag-theme-quartz"
      style={{
        width: '100%',
        height: `${48 * 2 + Math.min(rowData.length, 10) * 63 + Math.min(rowData.length, 10) + 3}px`,
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        pagination
        paginationPageSize={10}
        cacheBlockSize={20}
        onCellEditingStopped={onCellClicked}
      />
    </div>
  );
}

export default ShowDataTable;
