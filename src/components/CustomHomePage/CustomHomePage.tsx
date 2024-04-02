import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

import plusIcon from '@/public/assets/icons/plus.svg';

function CustomHomePage({
  heading,
  subHeading,
  msg,
  btnText,
  routeTo,
}: {
  heading: string;
  subHeading: string;
  msg: string;
  btnText: string;
  routeTo: string;
}) {
  const router = useRouter();
  return (
    <div className="p-20">
      <div className="mb-[72px] flex flex-col gap-3 pl-[7px]">
        <h2 className="font-poppins text-4xl font-medium text-darkslategray">
          {heading}
        </h2>
        <p className="font-poppins text-base font-normal text-neutral-2">
          {subHeading}
        </p>
      </div>
      <div
        style={{ boxShadow: '2px 2px 4px 1px rgba(9, 111, 144, 0.1);' }}
        className="box-border flex w-full flex-col items-center gap-12 rounded-xl border border-lightskyblue bg-neutral-7 px-[178px] py-12"
      >
        <h2 className="text-center font-poppins text-4xl font-medium text-neutral-1">
          {msg}
        </h2>
        <button
          type="button"
          className="flex h-16 items-center gap-3 rounded-lg bg-darkteal px-6 py-[14px]"
          onClick={() => router.push(routeTo)}
        >
          <Image src={plusIcon} alt="cta btn text" width={25} height={25} />
          <p className="font-poppins text-2xl font-normal text-primary-6">
            {btnText}
          </p>
        </button>
      </div>
    </div>
  );
}

export { CustomHomePage };
