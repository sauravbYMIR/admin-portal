/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

// eslint-disable-next-line import/no-extraneous-dependencies
import Image from 'next/image';
import React from 'react';

import { Login } from '@/components';
import brandLogo from '@/public/assets/images/brandLogo.svg';
import landingPageBanner from '@/public/assets/images/landingPageBanner.png';

import style from './page.module.scss';

function LandingPage() {
  return (
    <div className={style.landingPageContainer}>
      <div className={style.landingPageLeftSection}>
        <div className={style.brandLogoImg}>
          <Image src={brandLogo} alt="brand logo" />
        </div>
        <Login />
      </div>

      <div className={style.landingPageRightSection}>
        <Image
          className={style.bannerImg}
          src={landingPageBanner}
          alt="landing page banner image"
        />
      </div>
    </div>
  );
}

export default LandingPage;
