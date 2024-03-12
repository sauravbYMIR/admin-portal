/* eslint-disable jsx-a11y/label-has-associated-control */
import Image from 'next/image';
import { useState } from 'react';

// eslint-disable-next-line import/no-cycle
import CreateProcedureForm from '@/app/procedures/CreateProcedureForm/CreateProcedureForm';
import CreateSubCategoryForm from '@/app/procedures/CreateProcedureForm/CreateSubCategoryForm';
import closeIcon from '@/public/assets/icons/close.svg';

import procedureModalStyle from './procedureModal.module.scss';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProcedureModal({ isOpen, onClose }: DepartmentModalProps) {
  const [isProcedure, setIsProcedure] = useState(false);

  return (
    <div>
      {isOpen && (
        <div className={procedureModalStyle.modalOverlay}>
          <div className={procedureModalStyle.modal}>
            <div className={procedureModalStyle.modalHeader}>
              <h2 className={procedureModalStyle.title}>Create a procedure</h2>

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

              {isProcedure ? (
                <CreateProcedureForm />
              ) : (
                <CreateSubCategoryForm />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProcedureModal;
