'use client';

import { CustomHomePage, Header, WithAuth } from '@/components';

function HospitalsPage() {
  return (
    <div>
      <Header />
      <CustomHomePage
        heading="Hospitals"
        subHeading="List of all hospitals listed on the platform"
        msg="No hospitals have been add yet!"
        btnText="Add a hospital"
        routeTo="/hospitals/add"
      />
    </div>
  );
}

export default WithAuth(HospitalsPage);
