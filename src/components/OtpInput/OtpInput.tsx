'use client';

import React from 'react';
import OtpInput from 'react-otp-input';

import otpInputStyle from './otpInput.module.scss';

function OTPInputWrapper({
  otp,
  setOtp,
}: {
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
}) {
  const changeInputHandler = (x: string) => {
    setOtp(x);
  };

  return (
    <OtpInput
      value={otp}
      onChange={changeInputHandler}
      numInputs={4}
      renderInput={(props) => <input {...props} />}
      inputType="number"
      inputStyle={otpInputStyle.input}
      containerStyle={otpInputStyle.inputContainer}
    />
  );
}

export default OTPInputWrapper;
