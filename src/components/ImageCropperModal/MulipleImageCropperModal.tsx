// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css';

import React, { useState } from 'react';
import Cropper from 'react-cropper';

import { CloseIcon, ModalWrapper, ZoomInIcon, ZoomOutIcon } from '..';

export type MultipleImageCropperModalPropType = {
  imageFiles: File[];
  heading?: string;
  setIsModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  imageSetter: React.Dispatch<React.SetStateAction<File[] | null>>;
  aspectRatio?: 1 | { h: number; w: number };
};

const MultipleImageCropperModal = ({
  imageFiles,
  heading,
  setIsModalActive,
  imageSetter,
  aspectRatio,
}: MultipleImageCropperModalPropType) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cropper, setCropper] = useState<Cropper>();
  const [editedImages, setEditedImages] = useState<File[]>([...imageFiles]); // Track edited images

  const updateImageAtCurrentIndex = (file: File) => {
    const updatedImages = [...editedImages];
    updatedImages[currentIndex] = file;
    setEditedImages(updatedImages);
  };

  const handleSaveImage = (cropped: boolean) => {
    const currentImage = imageFiles[currentIndex];

    if (cropped && cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (!blob) return;
        if (!currentImage) return;
        const croppedFile = new File([blob], currentImage.name, {
          type: currentImage.type,
          lastModified: Date.now(),
        });
        updateImageAtCurrentIndex(croppedFile);
      });
    } else if (currentImage) {
      updateImageAtCurrentIndex(currentImage);
    }
  };

  const handleNext = () => {
    handleSaveImage(false); // Save original image without cropping
    setCurrentIndex((prev) => Math.min(prev + 1, imageFiles.length - 1));
  };

  const handlePrevious = () => {
    handleSaveImage(false); // Save original image without cropping
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleApply = () => {
    handleSaveImage(true); // Save cropped image
    if (currentIndex < imageFiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsModalActive(false); // Close when all images are done
      imageSetter(editedImages); // Send the edited images back
    }
  };

  const handleCloseModal = () => {
    setIsModalActive(false);
    imageSetter(imageFiles); // Reset to original files if closed
  };

  return (
    <ModalWrapper
      parentStyle="z-[9990] fixed top-0 left-0 after:backdrop-blur bg-zinc-900/70 flex items-center justify-center"
      childrenStyle="z-[9999] flex flex-col items-center justify-center sm:w-[600px] w-[280px] h-[511px] rounded-lg bg-white px-[24px] pt-[28px] pb-[59.1px] shadow-colorPickerShadow"
    >
      <div className="relative flex w-full items-center justify-between">
        {heading && (
          <p className="font-poppins text-lg font-medium leading-[18px]">
            {heading} ({currentIndex + 1}/{imageFiles.length})
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
          style={{ width: '100%', height: '278.55px' }}
          initialAspectRatio={
            // eslint-disable-next-line no-nested-ternary
            aspectRatio
              ? aspectRatio === 1
                ? 1
                : aspectRatio.w / aspectRatio.h
              : 1
          }
          src={
            imageFiles[currentIndex]
              ? // @ts-ignore
                URL.createObjectURL(imageFiles[currentIndex])
              : ''
          }
          onInitialized={(instance) => setCropper(instance)}
          zoomTo={0.5}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive
          autoCropArea={1}
          checkOrientation={false}
          guides
        />

        <div className="absolute bottom-2 right-0 flex items-center justify-center">
          <button
            onClick={() => cropper?.zoom(0.1)}
            type="button"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-md px-[15px] py-[5.05px] text-lg font-light leading-[18px] text-white"
          >
            <span className="hidden">zoom in</span>
            <ZoomInIcon />
          </button>
          <button
            onClick={() => cropper?.zoom(-0.1)}
            type="button"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-md px-[15px] py-[5.05px] text-lg font-light leading-[18px] text-white"
          >
            <span className="hidden">zoom out</span>
            <ZoomOutIcon />
          </button>
        </div>
      </div>

      <div className="flex w-full justify-between">
        <button
          onClick={handlePrevious}
          type="button"
          className="rounded-md bg-gray-300 px-4 py-2"
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        <div className="flex gap-4">
          <button
            onClick={handleCloseModal}
            type="button"
            className="rounded-lg border border-darkteal bg-white px-6 py-2 text-darkteal"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            type="button"
            className="rounded-lg bg-teal-600 px-6 py-2 text-white"
          >
            Apply & Next
          </button>
        </div>

        <button
          onClick={handleNext}
          type="button"
          className="rounded-md bg-teal-600 px-4 py-2 text-white"
          disabled={currentIndex === imageFiles.length - 1}
        >
          Next
        </button>
      </div>
    </ModalWrapper>
  );
};

export default MultipleImageCropperModal;
