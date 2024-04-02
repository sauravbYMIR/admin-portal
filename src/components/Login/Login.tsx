import { FbtButton } from '@frontbase/components-react';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import arrowIcon from '@/public/assets/icons/whiteArrow.svg';

import style from '../../app/page.module.scss';
import OTPInputWrapper from '../OtpInput/OtpInput';

export type LoginStep = {
  email: boolean;
  otp: boolean;
};
const emailFormSchema = z.object({
  email: z.string().email(),
});
export type EmailFormFields = z.infer<typeof emailFormSchema>;

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormFields>({
    resolver: zodResolver(emailFormSchema),
  });
  const onFormSubmit: SubmitHandler<EmailFormFields> = () => {
    setStep((prevState) => ({ ...prevState, otp: true, email: false }));
  };
  return (
    <div className={style.contentContainer}>
      <h2 className={style.headingText}>Log in</h2>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <label className={style.emailLabel} htmlFor="em">
          Email
          <input
            placeholder="Enter your email"
            className={style.emailInput}
            id="em"
            type="text"
            {...register('email')}
          />
          {errors.email && (
            <div className="text-center font-lexend text-base font-normal text-error">
              {errors.email.message}
            </div>
          )}
        </label>

        <FbtButton
          type="submit"
          className={style.landingPageCtaBtn}
          size="sm"
          variant="solid"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>Loading...</>
          ) : (
            <>
              <p className={style.ctaBtnText}>Verify email</p>
              <Image src={arrowIcon} alt="arrow icon cta button" />
            </>
          )}
        </FbtButton>
      </form>
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
        <p className="font-lexend text-xl font-light">OTP</p>
        <OTPInputWrapper />
      </div>
      {!isTimeElapsed ? (
        <Timer
          msg="Resend otp in"
          time={60}
          setIsTimeElapsed={setIsTimeElapsed}
        />
      ) : (
        <p className="mb-12 mt-[55px] font-poppins text-xl font-normal text-darkgray">
          Didn&apos;t receive OTP?
          <button
            type="button"
            className="ml-1 cursor-pointer border-none text-darkteal underline underline-offset-4"
          >
            Resend
          </button>
        </p>
      )}
      <FbtButton
        className={style.landingPageCtaBtn}
        size="sm"
        variant="solid"
        onClick={() => router.push('/patients')}
      >
        <p className={style.ctaBtnText}>Log in</p>
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
