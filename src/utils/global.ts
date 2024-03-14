import denmarkFlag from '@/public/assets/icons/denmarkFlag.svg';
import irelandFlag from '@/public/assets/icons/irelandFlag.svg';
import norwayFlag from '@/public/assets/icons/norwayFlag.svg';
import swedenFlag from '@/public/assets/icons/swedenFlag.svg';
import type { LanguagesType } from '@/types/components';

type CountryData = {
  name: string;
  language: LanguagesType;
  locale: string;
  currency: string;
  countryCode: string;
  flagIcon: string;
};

interface IntialLanguagesDataType {
  English: string;
  Norwegian: string;
  Danish: string;
  Swedish: string;
}

const countryData: CountryData[] = [
  {
    name: 'Ireland',
    language: 'English',
    locale: 'en',
    currency: 'EUR',
    countryCode: 'ie',
    flagIcon: irelandFlag,
  },
  {
    name: 'Norway',
    language: 'Norwegian',
    locale: 'nb',
    currency: 'NOK',
    countryCode: 'no',
    flagIcon: norwayFlag,
  },
  {
    name: 'Denmark',
    language: 'Danish',
    locale: 'da',
    currency: 'DKK',
    countryCode: 'dk',
    flagIcon: denmarkFlag,
  },
  {
    name: 'Sweden',
    language: 'Swedish',
    locale: 'sv',
    currency: 'SEK',
    countryCode: 'se',
    flagIcon: swedenFlag,
  },
];

const intialLanguagesData: IntialLanguagesDataType = {
  English: '',
  Norwegian: '',
  Danish: '',
  Swedish: '',
};

export { countryData, intialLanguagesData };
