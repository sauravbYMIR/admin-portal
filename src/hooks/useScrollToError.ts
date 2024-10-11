'use client';

import React from 'react';
import type { FieldErrors } from 'react-hook-form';

const useScrollToError = (errors: FieldErrors) => {
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const fieldElement = document.querySelector(
        `[name="${firstErrorField}"]`,
      );
      if (fieldElement) {
        fieldElement?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [errors]);
};

export default useScrollToError;
