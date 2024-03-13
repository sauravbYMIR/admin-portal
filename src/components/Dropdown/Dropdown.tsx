'use client';

import Image from 'next/image';
import { useState } from 'react';

import arrowDown from '@/public/assets/icons/arrowDown.svg';
import arrowUp from '@/public/assets/icons/arrowUp.svg';

import dropdownStyle from './dropdown.module.scss';

interface Option {
  value: any;
  label: string;
}

interface DropdownProps {
  options: Option[];
  onSelect: (value: any) => void;
  placeholder?: string;
  selectedValue?: any;
}

function Dropdown({
  options,
  onSelect,
  placeholder,
  selectedValue,
}: DropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (value: any) => {
    onSelect(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className={dropdownStyle.dropdownContainer}>
      <button
        type="button"
        onClick={toggleDropdown}
        className={dropdownStyle.select}
      >
        {selectedValue || placeholder}
        {isDropdownOpen ? (
          <Image
            src={arrowUp}
            alt="dropdown arrow up icon"
            width={24}
            height={24}
          />
        ) : (
          <Image
            src={arrowDown}
            alt="dropdown arrow down icon"
            width={24}
            height={24}
          />
        )}
      </button>
      {isDropdownOpen && (
        <ul className={dropdownStyle.optionsContainer}>
          {options.map((option) => (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
            <li
              className={dropdownStyle.option}
              key={option.value}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
