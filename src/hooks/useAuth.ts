import type { AxiosError } from 'axios';
import axios from 'axios';

export type ResendOtpResponse = {
  success: boolean;
  message: string;
};
export type VerifyOtpResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  message: string;
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
      message: 'resend-otp-successful',
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
    const response = await axios.post<{ status: number }>(
      `${process.env.BASE_URL}/auth/send-otp`,
      {
        email,
      },
    );
    return {
      success: response.status === 201,
      message: 'send-otp-successful',
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverError = err as AxiosError<ServerError>;
      if (serverError && serverError.response) {
        const errMsg = serverError.response as unknown as {
          data: { error: { message: string } };
        };
        return { success: false, message: errMsg.data.error.message };
      }
    }
    return { success: false, message: 'otp-verification-failed' };
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
      message: 'user-verify-successful',
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverError = err as AxiosError<ServerError>;
      if (serverError && serverError.response) {
        const errMsg = serverError.response as unknown as {
          data: { error: { message: string } };
        };
        return {
          success: false,
          message: errMsg.data.error.message,
          accessToken: '',
          refreshToken: '',
        };
      }
    }
    throw new Error('otp-verify-failed');
  }
};
