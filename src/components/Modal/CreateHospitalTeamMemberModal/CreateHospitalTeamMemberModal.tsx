/* eslint-disable jsx-a11y/label-has-associated-control */
import { FbtButton, FbtFileUpload } from '@frontbase/components-react';
import Image from 'next/image';

import closeIcon from '@/public/assets/icons/close.svg';
import { countryData } from '@/utils/global';

import modalStyle from './style.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateHospitalTeamMemberModal({ isOpen, onClose }: ModalProps) {
  return (
    <div>
      {isOpen && (
        <div className={modalStyle.modalOverlay}>
          <div className={modalStyle.modal}>
            <div className={modalStyle.modalHeader}>
              <h2 className={modalStyle.title}>Create a team member</h2>

              <Image
                className={modalStyle.closeButton}
                src={closeIcon}
                alt="modal close icon"
                width={24}
                height={24}
                onClick={onClose}
              />
            </div>

            <div className={modalStyle.modalBody}>
              <label className={modalStyle.label}>Position</label>

              <div className={modalStyle.languageTabContainer}>
                {countryData.map((data) => {
                  return (
                    <button key={data.locale} type="button">
                      {data.language}
                    </button>
                  );
                })}
              </div>

              <input
                className={modalStyle.input}
                style={{ marginBottom: '64px' }}
                type="text"
              />

              <label className={modalStyle.label}>Name & surname</label>
              <input
                className={modalStyle.input}
                style={{ margin: '8px 0 64px' }}
                type="text"
              />

              <label className={modalStyle.label}>Qualification</label>
              <input
                className={modalStyle.input}
                style={{ margin: '8px 0 64px' }}
                type="text"
              />

              <FbtFileUpload message="PNG, JPG  (max. 10 MB)" />

              <div className={modalStyle.checkboxContainer}>
                <input className={modalStyle.checkbox} type="checkbox" />
                <label className={modalStyle.checkboxLabel}>
                  Create another member
                </label>
              </div>

              <FbtButton
                className={modalStyle.createMemberBtn}
                variant="solid"
                size="sm"
              >
                <p>Create member</p>
              </FbtButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateHospitalTeamMemberModal;
