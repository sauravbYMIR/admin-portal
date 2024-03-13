import denmarkFlag from '@/public/assets/icons/denmarkFlag.svg';
import irelandFlag from '@/public/assets/icons/irelandFlag.svg';
import norwayFlag from '@/public/assets/icons/norwayFlag.svg';
import swedenFlag from '@/public/assets/icons/swedenFlag.svg';
import type { LanguagesType } from '@/types/components';

type Languages = {
  id: string;
  name: LanguagesType;
};

const languages: Languages[] = [
  {
    id: 'en',
    name: 'English',
  },
  {
    id: 'no',
    name: 'Norwegian',
  },
  {
    id: 'da',
    name: 'Danish',
  },
  {
    id: 'sv',
    name: 'Swedish',
  },
];

const reimbursementInputData = [
  { label: 'Denmark', iconSrc: denmarkFlag, code: 'DKK' },
  { label: 'Norway', iconSrc: norwayFlag, code: 'NOK' },
  { label: 'Ireland', iconSrc: irelandFlag, code: 'EUR' },
  { label: 'Sweden', iconSrc: swedenFlag, code: 'SEK' },
];

const intialLanguagesData = {
  English: '',
  Norwegian: '',
  Danish: '',
  Swedish: '',
};

export { intialLanguagesData, languages, reimbursementInputData };
