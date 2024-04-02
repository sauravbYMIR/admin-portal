'use client';

import { CustomHomePage } from '@/components';

function ProceduresList() {
  return (
    <div>
      <CustomHomePage
        heading="Procedure List"
        subHeading="List of all Procedures listed on the platform"
        msg="No departments have been added yet!"
        btnText="Add a department"
        routeTo="/procedures/add"
      />
    </div>
  );
}

export default ProceduresList;
