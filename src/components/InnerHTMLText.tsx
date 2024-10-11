'use client';

import DOMPurify from 'dompurify';
import React from 'react';

const InnerHTMLText = ({ text }: { text: string }) => {
  return (
    <div
      className="mb-12 font-lexend text-base font-light text-neutral-3"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(text),
      }}
    />
  );
};

export default InnerHTMLText;
