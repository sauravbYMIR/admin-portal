'use client';

import React, { useState } from 'react';
import OtpInput from 'react-otp-input';

import otpInputStyle from './otpInput.module.scss';

function OTPInputWrapper() {
  const [otp, setOtp] = useState('');

  const changeInputHandler = (x: any) => {
    setOtp(x);
    // console.log(x, 'code');
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
