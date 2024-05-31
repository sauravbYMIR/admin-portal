/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-cycle */

'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */

import { useEffect, useState } from 'react';

import CreateProcedureForm from '@/app/procedures/CreateProcedureForm/CreateProcedureForm';
import CreateSubCategoryForm from '@/app/procedures/CreateProcedureForm/CreateSubCategoryForm';
import { CloseIcon } from '@/components/Icons/Icons';

import procedureModalStyle from './procedureModal.module.scss';

export const SUBCAT = 'SUBCAT';
export const PROC = 'PROC';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
  editSubCategory?: boolean;
  updateId: string;
}

function ProcedureModal({
  isOpen,
  onClose,
  isEdit,
  editSubCategory,
  updateId,
}: DepartmentModalProps) {
  const [radioType, setRadioType] = useState<'SUBCAT' | 'PROC' | ''>(PROC);

  useEffect(() => {
    if (isEdit) {
      if (editSubCategory) {
        setRadioType(SUBCAT);
        return;
      }
      setRadioType(PROC);
    }
  }, [isEdit, editSubCategory]);

  return (
    <div>
      {isOpen && (
        <div className={procedureModalStyle.modalOverlay}>
          <div className={procedureModalStyle.modal}>
            <div className={procedureModalStyle.modalHeader}>
              <h2 className="font-poppins text-lg font-semibold text-neutral-1">
                {!isEdit
                  ? radioType === PROC
                    ? 'Create a procedure'
                    : 'Create a sub category'
                  : editSubCategory
                    ? 'Edit sub category'
                    : 'Edit procedure'}
              </h2>

              <button
                type="button"
                className="cursor-pointer"
                onClick={onClose}
              >
                <CloseIcon className="mb-2 size-6" strokeWidth={1.7} />
              </button>
            </div>

            <div className={procedureModalStyle.modalBody}>
              {!isEdit && (
                <div className={procedureModalStyle.radioSelectContainer}>
                  <div className={procedureModalStyle.radioWrapper}>
                    <label className="flex items-center gap-x-2 font-poppins text-base font-medium text-neutral-2">
                      <input
                        checked={radioType === PROC}
                        className="size-5"
                        type="radio"
                        onChange={() => setRadioType(PROC)}
                        id="PROC"
                        value={radioType}
                      />
                      <p>Create procedure</p>
                    </label>
                  </div>

                  <div className={procedureModalStyle.radioWrapper}>
                    <label className="flex items-center gap-x-2 font-poppins text-base font-medium text-neutral-2">
                      <input
                        checked={radioType === SUBCAT}
                        className="size-5"
                        type="radio"
                        onChange={() => setRadioType(SUBCAT)}
                        id="SUBCAT"
                        value={radioType}
                      />
                      <p>Create sub category</p>
                    </label>
                  </div>
                </div>
              )}
              {radioType === SUBCAT && (
                <CreateSubCategoryForm
                  isEdit={isEdit}
                  updateId={updateId}
                  onClose={onClose}
                />
              )}
              {radioType === PROC && (
                <CreateProcedureForm
                  isEdit={isEdit}
                  updateId={updateId}
                  onClose={onClose}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProcedureModal;
