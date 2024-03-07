/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

// eslint-disable-next-line import/no-extraneous-dependencies
import { FbtButton } from '@frontbase/components-react';
import Image from 'next/image';
import React, { useState } from 'react';

import arrowIcon from '@/public/assets/icons/whiteArrow.svg';
import brandLogo from '@/public/assets/images/brandLogo.svg';
import landingPageBanner from '@/public/assets/images/landingPageBanner.png';

import style from './page.module.scss';

function LandingPage() {
  const [isEmailSubmit, setIsEmailSubmit] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);

  const otpInputHandler = () => {
    setOtp(['', '', '', '']);
  };

  return (
    <div className={style.landingPageContainer}>
      <div className={style.landingPageLeftSection}>
        <div className={style.brandLogoImg}>
          <Image src={brandLogo} alt="brand logo" />
        </div>

        {isEmailSubmit ? (
          <div className={style.contentContainer}>
            <h2 className={style.otpHeadingText}>Verify with OTP</h2>
            <p className={style.otpDesc}>
              You will receive the OTP on your email
            </p>

            <div className={style.otpInputContainer}>
              <label className={style.otpInputLabel}>OTP</label>

              <div className={style.otpInputsWrapper}>
                {otp.map((digit, index) => {
                  return (
                    <input
                      className={style.otpInputBox}
                      type="number"
                      // eslint-disable-next-line react/no-array-index-key
                      key={index * index}
                      value={digit}
                      maxLength={1}
                      onChange={otpInputHandler}
                    />
                  );
                })}
              </div>
            </div>

            <p className={style.resendOtpText}>
              Resend OTP in <span>00:59</span>
            </p>

            <FbtButton
              className={style.landingPageCtaBtn}
              size="sm"
              variant="solid"
            >
              <p className={style.ctaBtnText}>Verify email</p>
              <Image src={arrowIcon} alt="arrow icon cta button" />
            </FbtButton>
          </div>
        ) : (
          <div className={style.contentContainer}>
            <h2 className={style.headingText}>Log in</h2>

            <label className={style.emailLabel} htmlFor="em">
              Email
              <input
                placeholder="Enter your email"
                className={style.emailInput}
                id="em"
                type="text"
              />
            </label>

            <FbtButton
              className={style.landingPageCtaBtn}
              size="sm"
              variant="solid"
              onClick={() => setIsEmailSubmit(true)}
            >
              <p className={style.ctaBtnText}>Verify with OTP</p>
              <Image src={arrowIcon} alt="arrow icon cta button" />
            </FbtButton>
          </div>
        )}
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
