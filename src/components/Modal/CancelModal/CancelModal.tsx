/* eslint-disable import/no-cycle */
import React from 'react';

import { CloseIcon } from '../../index';
import { ModalWrapper } from '../ModalWrapper/ModalWrapper';

function CancelModal({
  msg,
  onCancelHandler,
  onAcceptHandler,
  cancelMsg,
}: {
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
        <p className="text-left font-poppins text-2xl font-light text-neutral-2">
          {msg}
        </p>
        <div className="mt-16 flex w-full items-center justify-start gap-6">
          <button
            type="button"
            className="rounded-sm border-2 border-darkteal px-[111.75px] py-[14px] text-darkteal"
            onClick={onCancelHandler}
          >
            <p className="text-center font-poppins text-2xl font-medium">
              {cancelMsg}
            </p>
          </button>
          <button
            type="button"
            className="rounded-sm border-2 border-darkteal bg-darkteal px-[85.75px] py-[14px] text-white"
            onClick={onAcceptHandler}
          >
            <p className="text-center font-poppins text-2xl font-medium">
              Yes, Cancel
            </p>
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export { CancelModal };
