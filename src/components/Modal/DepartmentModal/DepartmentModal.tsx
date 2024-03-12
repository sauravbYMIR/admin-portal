/* eslint-disable jsx-a11y/label-has-associated-control */
import { FbtButton } from '@frontbase/components-react';
import Image from 'next/image';
import { useState } from 'react';

import closeIcon from '@/public/assets/icons/close.svg';

import departmentModalStyle from './departmentModal.module.scss';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
}

function DepartmentModal({ isOpen, onClose, isEdit }: DepartmentModalProps) {
  const [activeLanguageTab, setActiveLanguageTab] = useState('English');

  return (
    <div>
      {isOpen && (
        <div className={departmentModalStyle.modalOverlay}>
          <div className={departmentModalStyle.modal}>
            <div className={departmentModalStyle.modalHeader}>
              <h2 className={departmentModalStyle.title}>
                {isEdit ? 'Edit department' : 'Create a department'}
              </h2>

              <Image
                className={departmentModalStyle.closeButton}
                src={closeIcon}
                alt="modal close icon"
                width={24}
                height={24}
                onClick={onClose}
              />
            </div>

            <div className={departmentModalStyle.modalBody}>
              <label className={departmentModalStyle.departmentInputLabel}>
                Department name
              </label>

              <div className={departmentModalStyle.languageTabContainer}>
                <button
                  onClick={() => setActiveLanguageTab('English')}
                  className={
                    activeLanguageTab === 'English'
                      ? departmentModalStyle.activeLanguageTab
                      : ''
                  }
                  type="button"
                >
                  English
                </button>

                <button
                  onClick={() => setActiveLanguageTab('Norwegian')}
                  type="button"
                  className={
                    activeLanguageTab === 'Norwegian'
                      ? departmentModalStyle.activeLanguageTab
                      : ''
                  }
                >
                  Norwegian
                </button>

                <button
                  onClick={() => setActiveLanguageTab('Danish')}
                  className={
                    activeLanguageTab === 'Danish'
                      ? departmentModalStyle.activeLanguageTab
                      : ''
                  }
                  type="button"
                >
                  Danish
                </button>

                <button
                  onClick={() => setActiveLanguageTab('Swedish')}
                  className={
                    activeLanguageTab === 'Swedish'
                      ? departmentModalStyle.activeLanguageTab
                      : ''
                  }
                  type="button"
                >
                  Swedish
                </button>
              </div>

              <input
                className={departmentModalStyle.departmentInput}
                type="text"
                placeholder="Enter department"
              />

              <div className={departmentModalStyle.departmentCheckboxContainer}>
                <input
                  className={departmentModalStyle.checkbox}
                  type="checkbox"
                />
                <label className={departmentModalStyle.checkboxLabel}>
                  Create another department
                </label>
              </div>

              <FbtButton
                className={departmentModalStyle.createDepartmentBtn}
                size="sm"
                variant="solid"
              >
                <p className={departmentModalStyle.btnText}>
                  Create department
                </p>
              </FbtButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentModal;
