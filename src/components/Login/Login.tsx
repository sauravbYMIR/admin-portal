'use client';

import { FbtButton } from '@frontbase/components-react';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { toast, Toaster } from 'sonner';
import { z } from 'zod';

import { resendOTP, sendOTP, verifyOTP } from '@/hooks';
import arrowIcon from '@/public/assets/icons/whiteArrow.svg';
import { handleSetLocalStorage } from '@/utils/global';

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
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<EmailFormFields>({
    resolver: zodResolver(emailFormSchema),
  });
  const onFormSubmit: SubmitHandler<EmailFormFields> = async () => {
    try {
      const response = await sendOTP({ email: getValues('email') });
      if (response.success) {
        setStep((prevState) => ({ ...prevState, otp: true, email: false }));
        router.push(`?email=${getValues('email')}`, { scroll: false });
      }
    } catch (error) {
      toast.error('Email verification failed');
    }
  };
  return (
    <div className={style.contentContainer}>
      <h2 className={style.headingText}>Log in</h2>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <label className={style.emailLabel} htmlFor="email">
          Email
          <input
            placeholder="Enter your email"
            className={style.emailInput}
            id="email"
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
            <ClipLoader
              loading={isSubmitting}
              color="#fff"
              size={30}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
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
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();
  const [isTimeElapsed, setIsTimeElapsed] = React.useState<boolean>(false);
  const [otp, setOtp] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isOtpResendLoading, setIsOtpResendLoading] =
    React.useState<boolean>(false);
  const [isDisableResendBtn, setIsDisableResendBtn] =
    React.useState<boolean>(false);
  const handleOtpLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email not found, please try again');
      return;
    }
    setIsLoading(true);
    try {
      const response = await verifyOTP({ otp, email });
      if (!response.success) {
        toast.error('Incorrect otp');
        return;
      }
      if (response.success) {
        handleSetLocalStorage({
          tokenKey: 'access_token',
          tokenValue: response.accessToken,
        });
        handleSetLocalStorage({
          tokenKey: 'refresh_token',
          tokenValue: response.accessToken,
        });
        router.push('/patients');
      }
    } catch (error) {
      toast.error('Error while verifying otp, please try again');
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Email not found');
      return;
    }
    setIsDisableResendBtn(true);
    setIsOtpResendLoading(true);
    try {
      const r = await resendOTP({ email });
      if (r.success) {
        toast.success('Otp send successfully');
      }
    } catch (error) {
      toast.error('Resend otp failed, please try again');
    } finally {
      setIsDisableResendBtn(false);
      setIsOtpResendLoading(false);
    }
  };
  return (
    <form className={style.contentContainer}>
      <Toaster position="top-center" richColors closeButton />
      <h2 className={style.otpHeadingText}>Verify with OTP</h2>
      <p className={style.otpDesc}>You will receive the OTP on your email</p>
      <div className={style.otpInputContainer}>
        <p className="font-lexend text-xl font-light">OTP</p>
        <OTPInputWrapper otp={otp} setOtp={setOtp} />
      </div>
      {isTimeElapsed ? (
        <Timer
          msg="Resend otp in"
          time={60}
          setIsTimeElapsed={setIsTimeElapsed}
        />
      ) : (
        <button
          className={`mb-12 mt-[55px] font-poppins text-xl font-normal text-darkgray ${isDisableResendBtn ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          type="button"
          onClick={() => handleResendOtp()}
          disabled={isDisableResendBtn}
        >
          Didn&apos;t receive OTP?
          {isOtpResendLoading ? (
            <ClipLoader
              className="ml-4"
              loading={isOtpResendLoading}
              color="#096f90"
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <span className="ml-1 border-none text-darkteal underline underline-offset-4">
              Resend
            </span>
          )}
        </button>
      )}
      <FbtButton
        className={`${style.landingPageCtaBtn} ${otp.length < 4 ? 'cursor-not-allowed' : ''}`}
        size="sm"
        variant="solid"
        onClick={(e) => handleOtpLogin(e)}
        type="submit"
        disabled={otp.length < 4}
      >
        {isLoading ? (
          <ClipLoader
            loading={isLoading}
            color="#fff"
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <>
            <p className={style.ctaBtnText}>Log in</p>
            <Image src={arrowIcon} alt="arrow icon cta button" />
          </>
        )}
      </FbtButton>
    </form>
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
