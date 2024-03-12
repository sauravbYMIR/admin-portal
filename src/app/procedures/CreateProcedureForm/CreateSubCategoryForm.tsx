/* eslint-disable jsx-a11y/label-has-associated-control */
import { FbtButton } from '@frontbase/components-react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

// eslint-disable-next-line import/no-cycle
import { Dropdown } from '@/components';
import procedureModalStyle from '@/components/Modal/ProcedureModal/procedureModal.module.scss';

const options = [
  { value: 'epilepsy', label: 'epilepsy' },
  { value: 'dementia', label: 'dementia' },
  { value: 'cardio', label: 'cardio' },
  { value: 'cardiac arrest', label: 'cardiac arrest' },
  { value: 'malaria', label: 'malaria' },
  { value: 'tuberclusios', label: 'tuberclusios' },
];

function CreateSubCategoryForm() {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [createAnotherSubCategory, setCreateAnotherSubCategory] =
    useState(false);

  const [activeLanguageTab, setActiveLanguageTab] = useState<
    'English' | 'Norwegian' | 'Danish' | 'Swedish'
  >('English');

  const [subCategory, setSubCategory] = useState({
    English: '',
    Norwegian: '',
    Danish: '',
    Swedish: '',
  });

  const handleSelect = (value: string) => {
    setSelectedDepartment(value);
  };

  const handleSubCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubCategory((prevData) => ({
      ...prevData,
      [activeLanguageTab]: e.target.value,
    }));
  };

  const handleCreateSubCategory = () => {
    // API call to create sub category

    setSelectedDepartment('');
    setCreateAnotherSubCategory(false);
    setActiveLanguageTab('English');
    setSubCategory({
      English: '',
      Norwegian: '',
      Danish: '',
      Swedish: '',
    });
  };

  return (
    <div className={procedureModalStyle.createSubcategoryFormContainer}>
      <label
        style={{ display: 'block', marginBottom: '8px' }}
        className={procedureModalStyle.departmentInputLabel}
      >
        Department name
      </label>

      <Dropdown
        placeholder="Select department"
        selectedValue={selectedDepartment}
        options={options}
        onSelect={handleSelect}
      />

      <label
        style={{ display: 'block', marginTop: '24px' }}
        className={procedureModalStyle.subCategoryInputLabel}
      >
        Sub-category
      </label>

      <div className={procedureModalStyle.languageTabContainer}>
        <button
          onClick={() => setActiveLanguageTab('English')}
          className={
            activeLanguageTab === 'English'
              ? procedureModalStyle.activeLanguageTab
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
              ? procedureModalStyle.activeLanguageTab
              : ''
          }
        >
          Norwegian
        </button>

        <button
          onClick={() => setActiveLanguageTab('Danish')}
          className={
            activeLanguageTab === 'Danish'
              ? procedureModalStyle.activeLanguageTab
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
              ? procedureModalStyle.activeLanguageTab
              : ''
          }
          type="button"
        >
          Swedish
        </button>
      </div>

      <input
        className={procedureModalStyle.subCategoryInput}
        type="text"
        placeholder="Enter sub-category"
        value={subCategory[activeLanguageTab]}
        onChange={handleSubCategoryChange}
      />

      <div className={procedureModalStyle.procedureCheckboxContainer}>
        <input
          onClick={() => setCreateAnotherSubCategory(!createAnotherSubCategory)}
          checked={createAnotherSubCategory}
          className={procedureModalStyle.checkbox}
          type="checkbox"
        />
        <label className={procedureModalStyle.checkboxLabel}>
          Create another sub category
        </label>
      </div>

      <FbtButton
        className={procedureModalStyle.createProcedureBtn}
        size="sm"
        variant="solid"
        onClick={handleCreateSubCategory}
      >
        <p className={procedureModalStyle.btnText}>Create sub category</p>
      </FbtButton>
    </div>
  );
}

export default CreateSubCategoryForm;
