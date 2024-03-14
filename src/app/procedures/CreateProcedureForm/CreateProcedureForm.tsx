/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line simple-import-sort/imports
import { FbtButton } from '@frontbase/components-react';
import Image from 'next/image';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

// eslint-disable-next-line import/no-cycle
import { Dropdown } from '@/components';
import procedureModalStyle from '@/components/Modal/ProcedureModal/procedureModal.module.scss';
import type { LanguagesType } from '@/types/components';
import { countryData, intialLanguagesData } from '@/utils/global';

const options = [
  { value: 'epilepsy', label: 'epilepsy' },
  { value: 'dementia', label: 'dementia' },
  { value: 'cardio', label: 'cardio' },
  { value: 'cardiac arrest', label: 'cardiac arrest' },
  { value: 'malaria', label: 'malaria' },
  { value: 'tuberclusios', label: 'tuberclusios' },
];

interface CreateProcedureFormPropType {
  isEdit: boolean;
}

function CreateProcedureForm({ isEdit }: CreateProcedureFormPropType) {
  const [activeLanguageTab, setActiveLanguageTab] =
    useState<LanguagesType>('English');

  const [selectedDepartmentSubCategory, setSelectedDepartmentSubCategory] =
    useState('');

  const [createAnotherProcedure, setCreateAnotherProcedure] = useState(false);

  const [procedure, setProcedure] = useState(intialLanguagesData);

  const handleProcedureChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProcedure((prevData) => ({
      ...prevData,
      [activeLanguageTab]: e.target.value,
    }));
  };

  const handleSelect = (value: string) => {
    setSelectedDepartmentSubCategory(value);
  };

  const handleCreateProcedure = () => {
    // API call to create sub category

    setSelectedDepartmentSubCategory('');
    setCreateAnotherProcedure(false);
    setActiveLanguageTab('English');
    setProcedure(intialLanguagesData);
  };

  return (
    <div className={procedureModalStyle.createProcedureFormContainer}>
      <label
        style={{ marginBottom: '8px', display: 'block' }}
        className={procedureModalStyle.departmentInputLabel}
      >
        Department name/ Sub-category
      </label>

      <Dropdown
        placeholder="Select department"
        selectedValue={selectedDepartmentSubCategory}
        options={options}
        onSelect={handleSelect}
      />

      <label
        style={{ marginTop: '24px', display: 'block' }}
        className={procedureModalStyle.subCategoryInputLabel}
      >
        Procedure name
      </label>

      <div className={procedureModalStyle.languageTabContainer}>
        {countryData.map((data) => {
          return (
            <button
              key={data.locale}
              onClick={() => setActiveLanguageTab(data.language)}
              className={
                activeLanguageTab === data.language
                  ? procedureModalStyle.activeLanguageTab
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
        className={procedureModalStyle.procedureInput}
        style={{ marginBottom: '24px' }}
        type="text"
        placeholder="Enter procedure"
        value={procedure[activeLanguageTab]}
        onChange={handleProcedureChange}
      />

      <div className={procedureModalStyle.procedureReimbursementInputContainer}>
        {countryData.map((data) => {
          return (
            <div
              className={procedureModalStyle.procedureReimbursementInput}
              key={data.locale}
            >
              <label>Reimbursement for {data.name}</label>
              <div className={procedureModalStyle.inputWrapper}>
                <div className={procedureModalStyle.countryCodeWrapper}>
                  <Image src={data.flagIcon} alt="reimbursement input flag" />
                  <span>{data.currency}</span>
                </div>
                <input type="text" />
              </div>
            </div>
          );
        })}
      </div>

      {!isEdit && (
        <div
          className={procedureModalStyle.procedureCheckboxContainer}
          style={{ marginTop: '64px' }}
        >
          <input
            onClick={() => setCreateAnotherProcedure(!createAnotherProcedure)}
            checked={createAnotherProcedure}
            className={procedureModalStyle.checkbox}
            type="checkbox"
          />
          <label className={procedureModalStyle.checkboxLabel}>
            Create another procedure
          </label>
        </div>
      )}

      {isEdit ? (
        <FbtButton
          className={procedureModalStyle.createProcedureBtn}
          style={{ marginTop: '64px' }}
          size="sm"
          variant="solid"
          onClick={handleCreateProcedure}
        >
          <p className={procedureModalStyle.btnText}>Save changes</p>
        </FbtButton>
      ) : (
        <FbtButton
          className={procedureModalStyle.createProcedureBtn}
          size="sm"
          variant="solid"
          onClick={handleCreateProcedure}
        >
          <p className={procedureModalStyle.btnText}>Create procedure</p>
        </FbtButton>
      )}
    </div>
  );
}

export default CreateProcedureForm;
