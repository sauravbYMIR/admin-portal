/* eslint-disable import/no-cycle */
import React from 'react';

import { CloseIcon } from '../../index';
import { ModalWrapper } from '../ModalWrapper/ModalWrapper';

function CancelModal({
  heading,
  msg,
  onCancelHandler,
  onAcceptHandler,
  cancelMsg,
}: {
  heading: string;
  msg: string;
  onCancelHandler: () => void;
  onAcceptHandler: () => void;
  cancelMsg: string;
}) {
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
        <h2 className="mb-4 font-poppins text-2xl font-medium text-neutral-1">
          {heading}
        </h2>
        <p className="font-poppins text-base font-normal text-neutral-2">
          {msg}
        </p>
        <div className="mt-16 flex w-full items-center justify-start gap-6">
          <button
            type="button"
            className="flex w-[280px] cursor-pointer items-center justify-center rounded-lg border-2 border-neutral-3 bg-white px-4 py-[15px]"
            onClick={onCancelHandler}
          >
            <p className="font-poppins text-sm font-bold text-neutral-2">
              {cancelMsg}
            </p>
          </button>
          <button
            type="button"
            className="flex w-[280px] cursor-pointer items-center justify-center rounded-lg bg-darkteal px-4 py-[15px]"
            onClick={onAcceptHandler}
          >
            <p className="font-poppins text-sm font-bold text-white">
              Yes, Cancel
            </p>
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export { CancelModal };
