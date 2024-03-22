import { FbtButton } from '@frontbase/components-react';
import Image from 'next/image';

import { Header } from '@/components';
import backArrow from '@/public/assets/icons/backArrow.svg';

import style from './style.module.scss';

function HospitalProcedureManagement() {
  return (
    <div>
      <Header />

      <div className={style.procedureManagementContentContainer}>
        <Image src={backArrow} alt="back arrow" />

        <h2 className={style.title}>Procedure management</h2>

        <div className={style.procedureManagementCard}>
          <h3>No procedures have been added yet!</h3>

          <FbtButton className={style.btn} variant="solid" size="sm">
            <p>Add procedures</p>
          </FbtButton>
        </div>
      </div>
    </div>
  );
}

export default HospitalProcedureManagement;
