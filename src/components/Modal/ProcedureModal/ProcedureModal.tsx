'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import Image from 'next/image';
import { useEffect, useState } from 'react';

// eslint-disable-next-line import/no-cycle
import CreateProcedureForm from '@/app/procedures/CreateProcedureForm/CreateProcedureForm';
import CreateSubCategoryForm from '@/app/procedures/CreateProcedureForm/CreateSubCategoryForm';
import closeIcon from '@/public/assets/icons/close.svg';

import procedureModalStyle from './procedureModal.module.scss';

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
  const [isProcedure, setIsProcedure] = useState<boolean | undefined>(false);

  useEffect(() => {
    if (isEdit) {
      if (editSubCategory) {
        setIsProcedure(false);
      } else {
        setIsProcedure(true);
      }
    }
  }, [isEdit, editSubCategory]);

  return (
    <div>
      {isOpen && (
        <div className={procedureModalStyle.modalOverlay}>
          <div className={procedureModalStyle.modal}>
            <div className={procedureModalStyle.modalHeader}>
              <h2 className={procedureModalStyle.title}>
                {!isEdit
                  ? 'Create a procedure'
                  : editSubCategory
                    ? 'Edit sub category'
                    : 'Edit procedure'}
              </h2>

              <Image
                className={procedureModalStyle.closeButton}
                src={closeIcon}
                alt="modal close icon"
                width={24}
                height={24}
                onClick={onClose}
              />
            </div>

            <div className={procedureModalStyle.modalBody}>
              {!isEdit && (
                <div className={procedureModalStyle.radioSelectContainer}>
                  <div className={procedureModalStyle.radioWrapper}>
                    <input
                      checked={isProcedure}
                      className={procedureModalStyle.radio}
                      type="radio"
                      onClick={() => setIsProcedure(true)}
                    />
                    <label className={procedureModalStyle.radioLabel}>
                      Create <span>procedure</span>
                    </label>
                  </div>

                  <div className={procedureModalStyle.radioWrapper}>
                    <input
                      checked={!isProcedure}
                      className={procedureModalStyle.radio}
                      type="radio"
                      onClick={() => setIsProcedure(false)}
                    />
                    <label className={procedureModalStyle.radioLabel}>
                      Create <span>sub category</span>
                    </label>
                  </div>
                </div>
              )}

              {isProcedure ? (
                <CreateProcedureForm isEdit={isEdit} />
              ) : (
                <CreateSubCategoryForm isEdit={isEdit} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProcedureModal;
