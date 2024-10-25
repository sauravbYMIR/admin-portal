/* eslint-disable import/no-cycle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */
import 'cropperjs/dist/cropper.css';

import React from 'react';
import Cropper from 'react-cropper';

import { CloseIcon, ModalWrapper, ZoomInIcon, ZoomOutIcon } from '..';

export type ImageCropperModalPropType = {
  imageFile: File | null;
  heading?: string;
  setIsModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  imageSetter: React.Dispatch<React.SetStateAction<File | null>>;
  imageRef: React.RefObject<HTMLInputElement>;
  aspectRatio?: 1 | { h: number; w: number };
  setValue: any;
};
const ImageCropperModal = ({
  imageFile,
  heading,
  setIsModalActive,
  imageSetter,
  imageRef,
  aspectRatio,
  setValue,
  // isHandleUpload,
  // handleUploadType,
  // uploadKey,
  // uploadParamId,
}: ImageCropperModalPropType) => {
  const [cropper, setCropper] = React.useState<Cropper>();
  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      cropper
        .getCroppedCanvas({
          maxWidth: 3072,
          maxHeight: 3072,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
        })
        .toBlob((blob) => {
          if (!blob) return;
          if (imageFile) {
            const blobToFile = new File([blob], imageFile.name, {
              type: imageFile.type,
              lastModified: Date.now(),
            });
            imageSetter(blobToFile);
            setValue('logo', blobToFile);
          }
        });
      setIsModalActive(false);
    }
  };
  const handleCloseModal = () => {
    setIsModalActive(false);
    imageSetter(null);
    setValue('logo', null);
    if (imageRef && imageRef.current) {
      // eslint-disable-next-line no-param-reassign
      imageRef.current.value = '';
    }
  };

  const handleCropperZoomIn = () => {
    if (typeof cropper !== 'undefined') {
      cropper.zoom(0.1);
    }
  };
  const handleCropperZoomOut = () => {
    if (typeof cropper !== 'undefined') {
      cropper.zoom(-0.1);
    }
  };
  return (
    <ModalWrapper
      parentStyle="z-[9990] fixed top-0 left-0 after:backdrop-blur bg-zinc-900/70 flex items-center justify-center"
      childrenStyle="z-[9999] flex flex-col items-center justify-center sm:w-[600px] w-[280px] h-[511px] rounded-lg bg-white px-[24px] pt-[28px] pb-[59.1px] shadow-colorPickerShadow"
    >
      <div className="relative flex w-full items-center justify-between">
        {heading && (
          <p className="font-poppins text-lg font-medium leading-[18px]">
            {heading}
          </p>
        )}
        <button
          type="button"
          className="absolute right-0 top-[-5px] size-6 cursor-pointer"
          onClick={handleCloseModal}
        >
          <CloseIcon stroke="#B5B5B5" className="size-[18.05px]" />
          <span className="hidden">close</span>
        </button>
      </div>
      <div className="relative mb-14 mt-[23.92px] h-[278.55px] w-full">
        <Cropper
          style={{
            width: '100%',
            height: '278.55px',
          }}
          initialAspectRatio={
            aspectRatio
              ? aspectRatio === 1
                ? 1
                : aspectRatio.w / aspectRatio.h
              : 1
          }
          src={imageFile ? URL.createObjectURL(imageFile) : ''}
          onInitialized={(instance) => {
            setCropper(instance);
            if (aspectRatio !== 1) {
              instance.setData({
                x: 0,
                y: 0,
                width: aspectRatio?.w,
                height: aspectRatio?.h,
              });
            }
          }}
          zoomTo={0.5}
          preview=".img-preview"
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive
          autoCropArea={1}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          guides
        />
        <div className="absolute bottom-2 right-0 flex items-center justify-center">
          <button
            onClick={handleCropperZoomIn}
            type="button"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-md px-[15px] py-[5.05px] text-lg font-light leading-[18px] text-white"
          >
            <span className="sr-only">Zoom</span>
            <ZoomInIcon />
          </button>
          <button
            type="button"
            onClick={handleCropperZoomOut}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-md px-[15px] py-[5.05px] text-lg font-light leading-[18px] text-white"
          >
            <span className="sr-only">Zoom</span>
            <ZoomOutIcon />
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col items-end">
        <div className="flex items-center gap-x-4">
          <button
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-darkteal bg-white px-6 py-[14px]"
            onClick={handleCloseModal}
            type="button"
          >
            <span className="font-poppins text-base font-semibold text-darkteal">
              Cancel
            </span>
          </button>
          <button
            className="flex cursor-pointer items-center gap-3 rounded-lg bg-darkteal px-6 py-[14px]"
            onClick={getCropData}
            type="button"
          >
            <span className="font-poppins text-base font-semibold text-primary-6">
              Apply
            </span>
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ImageCropperModal;
