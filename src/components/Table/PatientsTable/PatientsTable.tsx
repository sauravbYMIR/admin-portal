/* eslint-disable import/no-extraneous-dependencies */

'use client';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './table.css';

import { AgGridReact } from 'ag-grid-react';

// interface RowData {
//   id: string;
//   name: string;
//   procedure: string;
//   hospital: string;
//   status: string;
// }

// const CustomStatusEditComponent = (props: CustomCellRendererProps) => {
//   const [showBtn, setShowBtn] = useState(true);
//   const router = useRouter();

//   const handleClickInfoLink = () => {
//     const patientBookingId = props?.data?.id;
//     router.push(`/patients/${patientBookingId}`);
//   };

//   return (
//     <div className={patientsTableStyle.patientsTableBtnContainer}>
//       {showBtn && (
//         <>
//           <FbtButton
//             className={patientsTableStyle.patientsTableAcceptBtn}
//             size="sm"
//             variant="solid"
//             onClick={() => setShowBtn(false)}
//           >
//             Accept
//           </FbtButton>

//           <FbtButton
//             className={patientsTableStyle.patientsTableRejectBtn}
//             size="sm"
//             variant="outline"
//             onClick={() => setShowBtn(false)}
//           >
//             Reject
//           </FbtButton>
//         </>
//       )}

//       <Image
//         className={patientsTableStyle.patientsTableInfoLink}
//         src={infoLinkIcon}
//         alt="patients table info link arrow icon"
//         onClick={handleClickInfoLink}
//       />
//     </div>
//   );
// };

function PatientsTable<T extends {}, U extends {}>({
  rowData,
  colDefs,
  onCellClicked,
}: {
  rowData: Array<T>;
  colDefs: Array<U>;
  onCellClicked?: (params: any) => void;
}): JSX.Element {
  // id, name, location
  // const [colDefs] = useState<any>([
  //   {
  //     field: 'name',
  //     flex: 1,
  //     filter: true,
  //     floatingFilter: true,
  //   },
  //   { field: 'procedure', flex: 1, filter: true, floatingFilter: true },
  //   { field: 'hospital', flex: 1, filter: true, floatingFilter: true },
  //   {
  //     field: 'status',
  //     cellStyle: (params: any) => {
  //       if (params.value === 'Pending') {
  //         return { backgroundColor: 'lightblue' };
  //       }
  //       if (params.value === 'Accepted') {
  //         return { backgroundColor: 'lightgreen' };
  //       }
  //       if (params.value === 'Rejected') {
  //         return { backgroundColor: '#FF8F8F' };
  //       }
  //       return null;
  //     },
  //     flex: 1,
  //     filter: true,
  //     floatingFilter: true,
  //   },
  // {
  //   field: '',
  //   flex: 2,
  //   cellRenderer: CustomStatusEditComponent,
  // },
  // ]);

  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname

    <div className="ag-theme-quartz" style={{ width: '100%', height: '408px' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        pagination
        paginationAutoPageSize
        cacheBlockSize={20}
        // onCellClicked={onCellClicked}
        onCellEditingStopped={onCellClicked}
      />
    </div>
  );
}

export default PatientsTable;
