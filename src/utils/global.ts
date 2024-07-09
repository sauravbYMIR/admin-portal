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

export const availableCountries = {
  Ireland: {
    language: 'English',
    locale: 'en',
    currency: 'EUR',
    countryCode: 'ie',
    flagIcon: irelandFlag,
  },
  Norway: {
    language: 'Norwegian',
    locale: 'nb',
    currency: 'NOK',
    countryCode: 'no',
    flagIcon: norwayFlag,
  },
  Denmark: {
    language: 'Danish',
    locale: 'da',
    currency: 'DKK',
    countryCode: 'dk',
    flagIcon: denmarkFlag,
  },
  Sweden: {
    language: 'Swedish',
    locale: 'sv',
    currency: 'SEK',
    countryCode: 'se',
    flagIcon: swedenFlag,
  },
};
export const availableCountriesByCountryCode = {
  ie: {
    language: 'English',
    locale: 'en',
    currency: 'EUR',
    countryCode: 'ie',
    flagIcon: irelandFlag,
    name: 'Ireland',
  },
  no: {
    language: 'Norwegian',
    locale: 'nb',
    currency: 'NOK',
    countryCode: 'no',
    flagIcon: norwayFlag,
    name: 'Norway',
  },
  dk: {
    language: 'Danish',
    locale: 'da',
    currency: 'DKK',
    countryCode: 'dk',
    flagIcon: denmarkFlag,
    name: 'Denmark',
  },
  se: {
    language: 'Swedish',
    locale: 'sv',
    currency: 'SEK',
    countryCode: 'se',
    flagIcon: swedenFlag,
    name: 'Sweden',
  },
};

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

const handleSetLocalStorage = ({
  tokenKey,
  tokenValue,
}: {
  tokenKey: string;
  tokenValue: string;
}) => {
  if (typeof window !== 'undefined') {
    return localStorage.setItem(tokenKey, tokenValue);
  }
  return null;
};

const handleGetLocalStorage = ({ tokenKey }: { tokenKey: string }) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(tokenKey);
  }
  return null;
};

const handleRemoveFromLocalStorage = ({ tokenKey }: { tokenKey: string }) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(tokenKey);
  }
};

const ACCEPT = 'ACCEPT';
const REJECT = 'REJECT';
const ACCEPTED = 'Accepted';
const REJECTED = 'Rejected';
const REQUESTED = 'Requested';

const SERVER_ERROR_MESSAGE = {
  'User-not-found': 'User not found',
  'otp-verification-failed': 'Otp verification failed',
  'resend-otp-successful': 'Resend otp successful',
  'send-otp-successful': 'Send otp successful',
  'otp-verify-failed': 'otp verify failed',
  'Incorrect-otp': 'Incorrect otp',
  'Hospital-member-associated-with-procedure':
    'Hospital member associated with procedure',
  'Hospital-procedure-already-present': 'Hospital procedure already present',
};

const convertToValidCurrency = ({
  locale,
  price,
  currency,
}: {
  locale: string;
  price: number;
  currency: string;
}) => price.toLocaleString(locale, { style: 'currency', currency });

export {
  ACCEPT,
  ACCEPTED,
  convertToValidCurrency,
  countryData,
  handleGetLocalStorage,
  handleRemoveFromLocalStorage,
  handleSetLocalStorage,
  intialLanguagesData,
  REJECT,
  REJECTED,
  REQUESTED,
  SERVER_ERROR_MESSAGE,
};
