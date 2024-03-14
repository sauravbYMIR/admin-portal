'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
import { FbtButton } from '@frontbase/components-react';
import Image from 'next/image';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

import closeIcon from '@/public/assets/icons/close.svg';
import type { LanguagesType } from '@/types/components';
import { countryData, intialLanguagesData } from '@/utils/global';

import departmentModalStyle from './departmentModal.module.scss';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean;
}

function DepartmentModal({ isOpen, onClose, isEdit }: DepartmentModalProps) {
  const [activeLanguageTab, setActiveLanguageTab] =
    useState<LanguagesType>('English');
  const [department, setDepartment] = useState(intialLanguagesData);

  const handleDepartmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDepartment((prevData) => ({
      ...prevData,
      [activeLanguageTab]: e.target.value,
    }));
  };

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
                {countryData.map((data) => {
                  return (
                    <button
                      key={data.locale}
                      onClick={() => setActiveLanguageTab(data.language)}
                      className={
                        activeLanguageTab === data.language
                          ? departmentModalStyle.activeLanguageTab
                          : ''
                      }
                      type="button"
                    >
                      {data.language}
                    </button>
                  );
                })}
              </div>

              <input
                className={departmentModalStyle.departmentInput}
                type="text"
                placeholder="Enter department"
                value={department[activeLanguageTab]}
                onChange={handleDepartmentChange}
              />

              {!isEdit && (
                <div
                  className={departmentModalStyle.departmentCheckboxContainer}
                >
                  <input
                    className={departmentModalStyle.checkbox}
                    type="checkbox"
                  />
                  <label className={departmentModalStyle.checkboxLabel}>
                    Create another department
                  </label>
                </div>
              )}

              {isEdit ? (
                <FbtButton
                  className={departmentModalStyle.createDepartmentBtn}
                  size="sm"
                  variant="solid"
                >
                  <p className={departmentModalStyle.btnText}>Save changes</p>
                </FbtButton>
              ) : (
                <FbtButton
                  className={departmentModalStyle.createDepartmentBtn}
                  size="sm"
                  variant="solid"
                >
                  <p className={departmentModalStyle.btnText}>
                    Create department
                  </p>
                </FbtButton>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentModal;
