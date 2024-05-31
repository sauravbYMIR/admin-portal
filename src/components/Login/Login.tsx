'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
import { z } from 'zod';

import { resendOTP, sendOTP, verifyOTP } from '@/hooks';
import brandLogo from '@/public/assets/images/brandLogo.svg';
import { handleSetLocalStorage, SERVER_ERROR_MESSAGE } from '@/utils/global';

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
    <p className="mb-9 mt-11 font-poppins text-sm font-normal text-darkgray">
      {msg}{' '}
      <span className="text-darkteal">
        00 : {reqTime === 0 ? '00' : reqTime}
      </span>
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
    watch,
  } = useForm<EmailFormFields>({
    resolver: zodResolver(emailFormSchema),
  });
  const onFormSubmit: SubmitHandler<EmailFormFields> = async () => {
    try {
      const response = await sendOTP({ email: getValues('email') });
      if (!response.success) {
        toast.error(
          SERVER_ERROR_MESSAGE[
            response.message as keyof typeof SERVER_ERROR_MESSAGE
          ],
        );
        return;
      }
      if (response.success) {
        setStep((prevState) => ({ ...prevState, otp: true, email: false }));
        router.push(`?email=${getValues('email')}`, { scroll: false });
      }
    } catch (error) {
      toast.error('Email verification failed');
    }
  };
  const email = watch('email');
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-[60px] mt-12 font-poppins text-[22px] font-medium text-neutral-2">
        Welcome, log in with your email address
      </h2>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex w-full flex-col"
      >
        <label className="flex flex-col items-start" htmlFor="email">
          <input
            placeholder="Enter your email"
            className="w-full rounded-lg px-4 py-[19px] placeholder:font-poppins placeholder:text-sm placeholder:font-normal placeholder:text-placeholdertextcolor"
            style={{ border: '1px solid rgba(17, 17, 17, 0.2)' }}
            id="email"
            type="text"
            {...register('email', {
              setValueAs: (value: string) => value.trim(),
            })}
          />
          {errors.email && (
            <div className="mt-2 text-center font-lexend text-base font-normal text-error">
              {errors.email.message}
            </div>
          )}
        </label>

        <button
          type="submit"
          className={`${!email || errors.email?.message ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} mt-8 flex items-center justify-center rounded-lg  py-[15px]`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ClipLoader
              loading={isSubmitting}
              color="#fff"
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <p className="font-poppins text-sm font-bold text-white">
              Verify email
            </p>
          )}
        </button>
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
        toast.error(
          SERVER_ERROR_MESSAGE[
            response.message as keyof typeof SERVER_ERROR_MESSAGE
          ],
        );
        return;
      }
      if (response.success) {
        handleSetLocalStorage({
          tokenKey: 'access_token',
          tokenValue: response.accessToken,
        });
        handleSetLocalStorage({
          tokenKey: 'refresh_token',
          tokenValue: response.refreshToken,
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
    setIsTimeElapsed(false);
    try {
      const r = await resendOTP({ email });
      if (r.success) {
        toast.success('Otp sent successfully');
      }
    } catch (error) {
      toast.error('Resend otp failed, please try again');
    } finally {
      setIsDisableResendBtn(false);
      setIsOtpResendLoading(false);
    }
  };
  return (
    <form className="mt-10 flex w-full flex-col items-center">
      <h2 className="font-poppins text-[22px] font-semibold text-neutral-1">
        Verify email with OTP
      </h2>
      <p className="mb-11 mt-3 font-poppins text-sm font-normal text-neutral-3">
        Kindly enter the 4 digits OTP sent to {email}
      </p>
      <div className={style.otpInputContainer}>
        <OTPInputWrapper otp={otp} setOtp={setOtp} />
      </div>
      {!isTimeElapsed ? (
        <Timer
          msg="Resend OTP in"
          time={60}
          setIsTimeElapsed={setIsTimeElapsed}
        />
      ) : (
        <button
          className={` mb-9 mt-11 font-poppins text-sm font-normal text-darkgray ${isDisableResendBtn ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          type="button"
          onClick={() => handleResendOtp()}
          disabled={isDisableResendBtn}
        >
          <div className="flex ">
            <span>Didn&apos;t receive OTP?</span>
            {isOtpResendLoading ? (
              <div className="ml-4">
                <ClipLoader
                  loading={isOtpResendLoading}
                  color="#096f90"
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : (
              <span className="ml-1 border-none text-darkteal underline underline-offset-4">
                Resend
              </span>
            )}
          </div>
        </button>
      )}
      <button
        className={`${otp.length < 4 ? 'cursor-not-allowed bg-darkteal/60' : 'cursor-pointer bg-darkteal'} mt-8 flex w-full items-center justify-center rounded-lg  py-[15px]`}
        onClick={(e) => handleOtpLogin(e)}
        type="submit"
        disabled={otp.length < 4}
      >
        {isLoading ? (
          <ClipLoader
            loading={isLoading}
            color="#fff"
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <p className="font-poppins text-sm font-bold text-white">Log in</p>
        )}
      </button>
    </form>
  );
}

function Login() {
  const [step, setStep] = React.useState<LoginStep>({
    email: true,
    otp: false,
  });
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src={brandLogo} alt="brand logo" />
      {step.email && <LoginWithMail setStep={setStep} />}
      {step.otp && <LoginWithOtp />}
    </div>
  );
}

export { Login, LoginWithMail, LoginWithOtp };
