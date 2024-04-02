/* eslint-disable import/no-cycle */
import React from 'react';

import { CloseIcon } from '../../index';
import { ModalWrapper } from '../ModalWrapper/ModalWrapper';

function ConfirmationModal() {
  return (
    <ModalWrapper
      parentStyle="z-[9990] fixed top-0 left-0 after:backdrop-blur bg-zinc-900/70 flex items-center justify-center"
      childrenStyle="z-[9999] flex flex-col items-center justify-center w-[739px] rounded-lg bg-white px-[24px] py-[32px] shadow-colorPickerShadow"
    >
      <div className="mb-4 flex w-full items-center justify-end">
        <button
          className="cursor-pointer border-none bg-transparent"
          type="button"
          aria-label="close"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <p className="text-left font-poppins text-2xl font-light text-neutral-2">
          Are you sure you want to accept Kevin Flanagano&apos;s procedure
          request. The application status will be updated immediately.You
          can&apos;t undo this action.
        </p>
        <div className="mt-16 flex w-full items-center justify-start gap-6">
          <button
            type="button"
            className="rounded-sm border-2 border-darkteal px-[111.75px] py-[14px] text-darkteal"
          >
            <p className="text-center font-poppins text-2xl font-medium">
              Cancel
            </p>
          </button>
          <button
            type="button"
            className="rounded-sm border-2 border-darkteal bg-darkteal px-[85.75px] py-[14px] text-white"
          >
            <p className="text-center font-poppins text-2xl font-medium">
              Yes, accept
            </p>
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export { ConfirmationModal };
