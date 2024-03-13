/* eslint-disable jsx-a11y/label-has-associated-control */
import { FbtButton } from '@frontbase/components-react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

// eslint-disable-next-line import/no-cycle
import { Dropdown } from '@/components';
import procedureModalStyle from '@/components/Modal/ProcedureModal/procedureModal.module.scss';
import type {
  IntialLanguagesDataType,
  LanguagesType,
} from '@/types/components';
import { intialLanguagesData, languages } from '@/utils/global';

const options = [
  { value: 'epilepsy', label: 'epilepsy' },
  { value: 'dementia', label: 'dementia' },
  { value: 'cardio', label: 'cardio' },
  { value: 'cardiac arrest', label: 'cardiac arrest' },
  { value: 'malaria', label: 'malaria' },
  { value: 'tuberclusios', label: 'tuberclusios' },
];

interface CreateSubCategoryFormPropType {
  isEdit: boolean;
}

function CreateSubCategoryForm({ isEdit }: CreateSubCategoryFormPropType) {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [createAnotherSubCategory, setCreateAnotherSubCategory] =
    useState(false);

  const [activeLanguageTab, setActiveLanguageTab] =
    useState<LanguagesType>('English');

  const [subCategory, setSubCategory] =
    useState<IntialLanguagesDataType>(intialLanguagesData);

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
    setSubCategory(intialLanguagesData);
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
        {languages.map((lang) => {
          return (
            <button
              key={lang.id}
              onClick={() => setActiveLanguageTab(lang.name)}
              className={
                activeLanguageTab === lang.name
                  ? procedureModalStyle.activeLanguageTab
                  : ''
              }
              type="button"
            >
              {lang.name}
            </button>
          );
        })}
      </div>

      <input
        className={procedureModalStyle.subCategoryInput}
        type="text"
        placeholder="Enter sub-category"
        value={subCategory[activeLanguageTab]}
        onChange={handleSubCategoryChange}
      />

      {!isEdit && (
        <div className={procedureModalStyle.procedureCheckboxContainer}>
          <input
            onClick={() =>
              setCreateAnotherSubCategory(!createAnotherSubCategory)
            }
            checked={createAnotherSubCategory}
            className={procedureModalStyle.checkbox}
            type="checkbox"
          />
          <label className={procedureModalStyle.checkboxLabel}>
            Create another sub category
          </label>
        </div>
      )}

      {isEdit ? (
        <FbtButton
          className={procedureModalStyle.createProcedureBtn}
          size="sm"
          variant="solid"
        >
          <p className={procedureModalStyle.btnText}>Save changes</p>
        </FbtButton>
      ) : (
        <FbtButton
          className={procedureModalStyle.createProcedureBtn}
          size="sm"
          variant="solid"
          onClick={handleCreateSubCategory}
        >
          <p className={procedureModalStyle.btnText}>Create sub category</p>
        </FbtButton>
      )}
    </div>
  );
}

export default CreateSubCategoryForm;
