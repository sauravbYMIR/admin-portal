import { FbtButton } from '@frontbase/components-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import arrowIcon from '@/public/assets/icons/whiteArrow.svg';

import style from '../../app/page.module.scss';
import OTPInputWrapper from '../OtpInput/OtpInput';

export type LoginStep = {
  email: boolean;
  otp: boolean;
};

function Timer({
  time,
  msg,
  setIsTimeElapsed,
}: {
  time: number;
  msg: string;
  setIsTimeElapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // currently supports time in only seconds
  const [reqTime, setReqTime] = React.useState(time);

  React.useEffect(() => {
    let cleanup: string | number | NodeJS.Timeout | undefined;
    console.log('here');
    if (reqTime === 0) {
      setIsTimeElapsed(true);
    }
    if (reqTime > 0) {
      cleanup = setInterval(() => {
        setReqTime((prevState) => prevState - 1);
      }, 1000);
    }

    return () => {
      clearInterval(cleanup);
    };
  }, [reqTime, setIsTimeElapsed]);

  return (
    <p className={style.resendOtpText}>
      {msg} <span>00 : {reqTime === 0 ? '00' : reqTime}</span>
    </p>
  );
}

function LoginWithMail({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<LoginStep>>;
}) {
  return (
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
        onClick={() =>
          setStep((prevState) => ({ ...prevState, otp: true, email: false }))
        }
      >
        <p className={style.ctaBtnText}>Verify email</p>
        <Image src={arrowIcon} alt="arrow icon cta button" />
      </FbtButton>
    </div>
  );
}

function LoginWithOtp() {
  const router = useRouter();
  const [isTimeElapsed, setIsTimeElapsed] = React.useState<boolean>(false);
  return (
    <div className={style.contentContainer}>
      <h2 className={style.otpHeadingText}>Verify with OTP</h2>
      <p className={style.otpDesc}>You will receive the OTP on your email</p>

      <div className={style.otpInputContainer}>
        <p className={style.otpInputp}>OTP</p>

        <OTPInputWrapper />
      </div>

      {!isTimeElapsed ? (
        <Timer
          msg="Resend otp in"
          time={60}
          setIsTimeElapsed={setIsTimeElapsed}
        />
      ) : (
        <p className="font-poppins text-xl font-medium text-darkgray">
          Didn&apos;t receive OTP?
          <button
            type="button"
            className="cursor-pointer border-none text-darkteal underline-offset-4"
          >
            Resend otp
          </button>
        </p>
      )}

      <FbtButton
        className={style.landingPageCtaBtn}
        size="sm"
        variant="solid"
        onClick={() => router.push('/patients')}
      >
        <p className={style.ctaBtnText}>Login</p>
        <Image src={arrowIcon} alt="arrow icon cta button" />
      </FbtButton>
    </div>
  );
}

function Login() {
  const [step, setStep] = React.useState<LoginStep>({
    email: true,
    otp: false,
  });
  return (
    <>
      {step.email && <LoginWithMail setStep={setStep} />}
      {step.otp && <LoginWithOtp />}
    </>
  );
}

export { Login, LoginWithMail, LoginWithOtp };
