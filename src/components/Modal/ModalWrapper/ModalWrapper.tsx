'use client';

import React, { useEffect } from 'react';

const ModalWrapper: React.FC<{
  children: React.ReactNode;
  parentStyle?: string;
  childrenStyle?: string;
}> = ({ children, parentStyle, childrenStyle }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className={`${parentStyle} flex min-h-screen w-screen items-center justify-center`}
    >
      <div className={`${childrenStyle}`}>{children}</div>
    </div>
  );
};

export { ModalWrapper };
