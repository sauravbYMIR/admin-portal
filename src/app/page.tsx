/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

// eslint-disable-next-line import/no-extraneous-dependencies
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Login } from '@/components';
import landingPageBanner from '@/public/assets/images/landingPageBanner.png';
import { handleGetLocalStorage } from '@/utils/global';

import style from './page.module.scss';

function LandingPage() {
  const accessToken = handleGetLocalStorage({ tokenKey: 'access_token' });
  const router = useRouter();
  React.useEffect(() => {
    if (accessToken) {
      router.push('/patients');
    }
  }, [accessToken, router]);

  return (
    <div className="flex h-screen w-screen justify-between overflow-y-hidden">
      <div className="flex flex-1 items-center justify-center">
        <Login />
      </div>
      <div className="flex-1">
        <Image
          className={style.bannerImg}
          src={landingPageBanner}
          alt="landing page banner img"
        />
      </div>
    </div>
  );
}

export default LandingPage;
