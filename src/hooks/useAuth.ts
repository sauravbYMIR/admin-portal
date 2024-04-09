import type { AxiosError } from 'axios';
import axios from 'axios';

export type ResendOtpResponse = {
  success: boolean;
};
export type VerifyOtpResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};
export type ServerError = {
  response: {
    data: {
      error: {
        error: string;
        message: string;
        statusCode: number;
      };
    };
  };
};
export const resendOTP = async ({
  email,
}: {
  email: string;
}): Promise<ResendOtpResponse> => {
  try {
    const response = await axios.post<ResendOtpResponse>(
      `${process.env.BASE_URL}/auth/resend-otp`,
      {
        email,
      },
    );
    return {
      success: response.data.success,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverError = err as AxiosError<ServerError>;

      if (serverError && serverError.response) {
        throw new Error('otp-verify-failed');
      }
    }
    throw new Error('otp-verify-failed');
  }
};
export const sendOTP = async ({
  email,
}: {
  email: string;
}): Promise<ResendOtpResponse> => {
  try {
    const response = await axios.post<ResendOtpResponse>(
      `${process.env.BASE_URL}/auth/send-otp`,
      {
        email,
      },
    );
    return {
      success: response.data.success,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverError = err as AxiosError<ServerError>;

      if (serverError && serverError.response) {
        throw new Error('otp-verify-failed');
      }
    }
    throw new Error('otp-verify-failed');
  }
};
export const verifyOTP = async ({
  otp,
  email,
}: {
  email: string;
  otp: string;
}): Promise<VerifyOtpResponse> => {
  try {
    const response = await axios.post<VerifyOtpResponse>(
      `${process.env.BASE_URL}/auth/verify-otp`,
      {
        email,
        otp,
      },
    );
    return {
      success: response.data.success,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverError = err as AxiosError<ServerError>;

      if (serverError && serverError.response) {
        throw new Error('otp-verify-failed');
      }
    }
    throw new Error('otp-verify-failed');
  }
};
