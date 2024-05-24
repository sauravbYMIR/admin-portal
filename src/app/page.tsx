/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

// eslint-disable-next-line import/no-extraneous-dependencies
import Image from 'next/image';
import React from 'react';

import { Login } from '@/components';
import landingPageBanner from '@/public/assets/images/landingPageBanner.png';

import style from './page.module.scss';

function LandingPage() {
  return (
    <div className="flex w-screen justify-between">
      <div className="flex flex-1 items-center justify-center">
        <Login />
      </div>
      <div className="flex-1">
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
