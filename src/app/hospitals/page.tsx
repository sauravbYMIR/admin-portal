'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { CustomHomePage, Header, WithAuth } from '@/components';
import plusIcon from '@/public/assets/icons/plus.svg';

function HospitalsPage() {
  const router = useRouter();
  return (
    <div>
      <Header />
      <CustomHomePage
        heading="Hospitals"
        subHeading="List of all hospitals listed on the platform"
      >
        {true ? (
          <p>hello</p>
        ) : (
          <div
            style={{ boxShadow: '2px 2px 4px 1px rgba(9, 111, 144, 0.1)' }}
            className="box-border flex w-full flex-col items-center gap-12 rounded-xl border border-lightskyblue bg-neutral-7 px-[178px] py-12"
          >
            <h2 className="text-center font-poppins text-4xl font-medium text-neutral-1">
              No hospitals have been add yet!
            </h2>
            <button
              type="button"
              className="flex h-16 items-center gap-3 rounded-lg bg-darkteal px-6 py-[14px]"
              onClick={() => router.push('/hospitals/add')}
            >
              <Image src={plusIcon} alt="cta btn text" width={25} height={25} />
              <p className="font-poppins text-2xl font-normal text-primary-6">
                Add a hospital
              </p>
            </button>
          </div>
        )}
      </CustomHomePage>
    </div>
  );
}

export default WithAuth(HospitalsPage);
