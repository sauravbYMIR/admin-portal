/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { FbtButton } from '@frontbase/components-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Header } from '@/components';
import plusIcon from '@/public/assets/icons/plus.svg';

import hospitalsStyle from './hospitals.module.scss';

function HospitalsPage() {
  const router = useRouter();

  return (
    <div>
      <Header />

      <div className={hospitalsStyle.hospitalsPageContentContainer}>
        <div className={hospitalsStyle.titleContainer}>
          <h2 className={hospitalsStyle.title}>Hospitals</h2>

          <p className={hospitalsStyle.desc}>
            List of all hospitals listed on the platform
          </p>
        </div>

        <div className={hospitalsStyle.addHospitalContainer}>
          <h2 className={hospitalsStyle.subTitle}>
            No hospitals have been add yet!
          </h2>

          <FbtButton
            className={hospitalsStyle.addHospitalBtn}
            size="sm"
            variant="solid"
            onClick={() => router.push('/hospitals/add')}
          >
            <Image src={plusIcon} alt="plus icon cta button" />
            <p className={hospitalsStyle.btnText}>Add a hospital</p>
          </FbtButton>
        </div>
      </div>
    </div>
  );
}

export default HospitalsPage;
