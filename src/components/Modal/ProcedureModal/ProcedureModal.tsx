/* eslint-disable import/no-cycle */

'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */

import Image from 'next/image';
import { useEffect, useState } from 'react';

import CreateProcedureForm from '@/app/procedures/CreateProcedureForm/CreateProcedureForm';
import CreateSubCategoryForm from '@/app/procedures/CreateProcedureForm/CreateSubCategoryForm';
import closeIcon from '@/public/assets/icons/close.svg';

import procedureModalStyle from './procedureModal.module.scss';

export const SUBCAT = 'SUBCAT';
export const PROC = 'PROC';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editSubCategory?: boolean;
}

function ProcedureModal({
  isOpen,
  onClose,
  isEdit,
  editSubCategory,
}: DepartmentModalProps) {
  const [radioType, setRadioType] = useState<'SUBCAT' | 'PROC'>(SUBCAT);

  useEffect(() => {
    if (isEdit) {
      if (editSubCategory) {
        setRadioType(SUBCAT);
      } else {
        setRadioType(PROC);
      }
    }
  }, [isEdit, editSubCategory]);

  console.log({ radioType, v: radioType === PROC, b: radioType === SUBCAT });

  return (
    <div>
      {isOpen && (
        <div className={procedureModalStyle.modalOverlay}>
          <div className={procedureModalStyle.modal}>
            <div className={procedureModalStyle.modalHeader}>
              <h2 className={procedureModalStyle.title}>
                {!isEdit
                  ? radioType === PROC
                    ? 'Create a procedure'
                    : 'Create a sub category'
                  : editSubCategory
                    ? 'Edit sub category'
                    : 'Edit procedure'}
              </h2>

              <button
                onClick={onClose}
                type="button"
                className="cursor-pointer"
              >
                <Image
                  src={closeIcon}
                  alt="modal close icon"
                  width={24}
                  height={24}
                />
              </button>
            </div>

            <div className={procedureModalStyle.modalBody}>
              {!isEdit && (
                // <FbtRadioGroup
                //   defaultValue={radioType}
                //   className="!mb-6 !flex !items-center"
                // >
                //   <div className="mr-14 flex items-center space-x-2">
                //     <FbtRadioGroupItem
                //       value={radioType}
                //       className={procedureModalStyle.radio}
                //       onChange={() => setRadioType(PROC)}
                //       id={radioType}
                //     />
                //     <FbtLabel
                //       className={procedureModalStyle.radioLabel}
                //       htmlFor={radioType}
                //     >
                //       Create procedure
                //     </FbtLabel>
                //   </div>
                //   <div className="flex items-center space-x-2">
                //     <FbtRadioGroupItem
                //       value={radioType}
                //       className={procedureModalStyle.radio}
                //       onChange={() => setRadioType(SUBCAT)}
                //       id={radioType}
                //     />
                //     <FbtLabel
                //       className={procedureModalStyle.radioLabel}
                //       htmlFor={radioType}
                //     >
                //       Create sub category
                //     </FbtLabel>
                //   </div>
                // </FbtRadioGroup>
                <div className={procedureModalStyle.radioSelectContainer}>
                  <div className={procedureModalStyle.radioWrapper}>
                    <input
                      checked={radioType === PROC}
                      className={procedureModalStyle.radio}
                      type="radio"
                      onChange={() => setRadioType(PROC)}
                      id={PROC}
                      name={PROC}
                      value={radioType}
                    />
                    <label
                      className={procedureModalStyle.radioLabel}
                      htmlFor={PROC}
                    >
                      Create procedure
                    </label>
                  </div>

                  <div className={procedureModalStyle.radioWrapper}>
                    <input
                      checked={radioType === SUBCAT}
                      className={procedureModalStyle.radio}
                      type="radio"
                      onChange={() => setRadioType(SUBCAT)}
                      id={SUBCAT}
                      name={SUBCAT}
                      value={radioType}
                    />
                    <label
                      className={procedureModalStyle.radioLabel}
                      htmlFor={SUBCAT}
                    >
                      Create sub category
                    </label>
                  </div>
                </div>
              )}
              {radioType === SUBCAT && (
                <CreateSubCategoryForm isEdit={isEdit} />
              )}
              {radioType === PROC && <CreateProcedureForm isEdit={isEdit} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProcedureModal;
