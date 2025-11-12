import { z } from 'zod';

import type { HospitalProcedureFormSchemaType } from '@/app/hospitals/add/[id]/procedures/[procedureId]/edit/page';
import type { HospitalDescFormSchemaType } from '@/app/hospitals/add/page';
import type { RoleFormSchemaType } from '@/components/Modal/AddTeamMemberToHospitalProcedure/AddTeamMemberToHospitalProcedure';
import type {
  HospitalQualificationFormSchemaType,
  PositionFormSchemaType,
} from '@/components/Modal/CreateHospitalTeamMemberModal/CreateHospitalTeamMemberModal';
import type {
  CountryCode,
  Locale,
} from '@/components/Modal/DepartmentModal/DepartmentModal';
import denmarkFlag from '@/public/assets/icons/denmarkFlag.svg';
import estoniaFlag from '@/public/assets/icons/estoniaFlag.svg';
import finlandFlag from '@/public/assets/icons/finlandFlag.svg';
import irelandFlag from '@/public/assets/icons/irelandFlag.svg';
import latviaFlag from '@/public/assets/icons/latviaFlag.svg';
import lithuaniaFlag from '@/public/assets/icons/lithuaniaFlag.svg';
import netherlandFlag from '@/public/assets/icons/netherlandFlag.svg';
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

export const availableCurrency = ['EUR', 'NOK', 'DKK', 'SEK', ''] as const;
export type AvailableCurrencyType = 'EUR' | 'NOK' | 'DKK' | 'SEK';

export const brandName = 'Medipath';

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
  Netherlands: {
    language: 'Dutch',
    locale: 'nl',
    currency: 'EUR',
    countryCode: 'nl',
    flagIcon: netherlandFlag,
  },
  Finland: {
    language: 'Finnish',
    locale: 'fi',
    currency: 'EUR',
    countryCode: 'fi',
    flagIcon: finlandFlag,
  },
  Latvia: {
    language: 'Latvian',
    locale: 'lv',
    currency: 'EUR',
    countryCode: 'lv',
    flagIcon: latviaFlag,
  },
  Lithuania: {
    language: 'Lithuanian',
    locale: 'lt',
    currency: 'EUR',
    countryCode: 'lt',
    flagIcon: lithuaniaFlag,
  },
  Estonia: {
    language: 'Estonian',
    locale: 'et',
    currency: 'EUR',
    countryCode: 'ee',
    flagIcon: estoniaFlag,
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
  nl: {
    name: 'Netherlands',
    language: 'Dutch',
    locale: 'nl',
    currency: 'EUR',
    countryCode: 'nl',
    flagIcon: netherlandFlag,
  },
  fi: {
    name: 'Finland',
    language: 'Finnish',
    locale: 'fi',
    currency: 'EUR',
    countryCode: 'fi',
    flagIcon: finlandFlag,
  },
  lv: {
    name: 'Latvia',
    language: 'Latvian',
    locale: 'lv',
    currency: 'EUR',
    countryCode: 'lv',
    flagIcon: latviaFlag,
  },
  lt: {
    name: 'Lithuania',
    language: 'Lithuanian',
    locale: 'lt',
    currency: 'EUR',
    countryCode: 'lt',
    flagIcon: lithuaniaFlag,
  },
  ee: {
    name: 'Estonia',
    language: 'Estonian',
    locale: 'et',
    currency: 'EUR',
    countryCode: 'ee',
    flagIcon: estoniaFlag,
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
  {
    name: 'Netherlands',
    language: 'Dutch',
    locale: 'nl',
    currency: 'EUR',
    countryCode: 'nl',
    flagIcon: netherlandFlag,
  },
  {
    name: 'Finland',
    language: 'Finnish',
    locale: 'fi',
    currency: 'EUR',
    countryCode: 'fi',
    flagIcon: finlandFlag,
  },
  {
    name: 'Latvia',
    language: 'Latvian',
    locale: 'lv',
    currency: 'EUR',
    countryCode: 'lv',
    flagIcon: latviaFlag,
  },
  {
    name: 'Lithuania',
    language: 'Lithuanian',
    locale: 'lt',
    currency: 'EUR',
    countryCode: 'lt',
    flagIcon: lithuaniaFlag,
  },
  {
    name: 'Estonia',
    language: 'Estonian',
    locale: 'et',
    currency: 'EUR',
    countryCode: 'ee',
    flagIcon: estoniaFlag,
  },
  // {
  //   name: 'Belgium',
  //   language: 'Dutch',
  //   locale: 'nl',
  //   currency: 'EUR',
  //   countryCode: 'be',
  //   flagIcon: '',
  // },
] as const;

const genderObject = {
  men: {
    value: 'Male',
  },
  women: {
    value: 'Female',
  },
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

export type ProcedureSchemaType = `procedure${Capitalize<Locale>}`;
export type ReimbusementSchemaType = `reimbursement${Capitalize<CountryCode>}`;
export type SubCategoryFormSchemaType = `subCategory${Capitalize<Locale>}`;

// zod schema
const ProcedureDescSchema = countryData.reduce(
  (acc, currValue) => {
    const schema =
      `procedureDesc${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}` as HospitalProcedureFormSchemaType;
    acc[schema] = z
      .string()
      .min(1, { message: 'Fill in details in all the languages' });
    return acc;
  },
  {} as Record<HospitalProcedureFormSchemaType, z.ZodString>,
);
const ProcedureSchema = countryData.reduce(
  (acc, currValue) => {
    const schema =
      `procedure${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}` as ProcedureSchemaType;
    acc[schema] = z
      .string()
      .min(1, { message: 'Fill in details in all the languages' });
    return acc;
  },
  {} as Record<ProcedureSchemaType, z.ZodString>,
);
const HospitalDescSchema = countryData.reduce(
  (acc, currValue) => {
    const schema =
      `hospitalDesc${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}` as HospitalDescFormSchemaType;
    acc[schema] = z
      .string()
      .min(1, { message: 'Add description in all languages' });
    return acc;
  },
  {} as Record<HospitalDescFormSchemaType, z.ZodString>,
);
const SubCategorySchema = countryData.reduce(
  (acc, currValue) => {
    const schema =
      `subCategory${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}` as SubCategoryFormSchemaType;
    acc[schema] = z
      .string()
      .min(1, { message: 'Fill in details in all the languages' });
    return acc;
  },
  {} as Record<SubCategoryFormSchemaType, z.ZodString>,
);
const QualificationSchema = countryData.reduce(
  (acc, currValue) => {
    const schema =
      `qualification${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}` as HospitalQualificationFormSchemaType;
    acc[schema] = z
      .string()
      .min(1, { message: 'Fill in details in all the languages' });
    return acc;
  },
  {} as Record<HospitalQualificationFormSchemaType, z.ZodString>,
);
const PositionSchema = countryData.reduce(
  (acc, currValue) => {
    const schema =
      `position${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}` as PositionFormSchemaType;
    acc[schema] = z
      .string()
      .min(1, { message: 'Fill in details in all the languages' });
    return acc;
  },
  {} as Record<PositionFormSchemaType, z.ZodString>,
);
const RoleSchema = countryData.reduce(
  (acc, currValue) => {
    const schema =
      `role${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}` as RoleFormSchemaType;
    acc[schema] = z
      .string()
      .min(1, { message: 'Fill in details in all the languages' });
    return acc;
  },
  {} as Record<RoleFormSchemaType, z.ZodString>,
);
const ReimbursementSchema = countryData.reduce(
  (acc, currValue) => {
    const schema =
      `reimbursement${currValue.countryCode.charAt(0).toUpperCase()}${currValue.countryCode.slice(1)}` as ReimbusementSchemaType;
    // @ts-ignore
    acc[schema] = z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: 'Fill in all required details in correct format',
    });
    return acc;
  },
  {} as Record<ReimbusementSchemaType, z.ZodString>,
);

// objects
const hospitalProcedureDescObj = countryData.reduce(
  (acc, currValue) => {
    const value = `procedureDesc${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}`;
    acc[currValue.language] = value;
    return acc;
  },
  {} as Record<string, string>,
);
const hospitalDescObj = countryData.reduce(
  (acc, currValue) => {
    const value = `hospitalDesc${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}`;
    acc[currValue.language] = value;
    return acc;
  },
  {} as Record<string, string>,
);
const procedureObj = countryData.reduce(
  (acc, currValue) => {
    const value = `procedure${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}`;
    acc[currValue.language] = value;
    return acc;
  },
  {} as Record<string, string>,
);
const subCategoryObj = countryData.reduce(
  (acc, currValue) => {
    const value = `subCategory${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}`;
    acc[currValue.language] = value;
    return acc;
  },
  {} as Record<string, string>,
);
const positionObj = countryData.reduce(
  (acc, currValue) => {
    const value = `position${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}`;
    acc[currValue.language] = value;
    return acc;
  },
  {} as Record<string, string>,
);
const qualificationObj = countryData.reduce(
  (acc, currValue) => {
    const value = `qualification${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}`;
    acc[currValue.language] = value;
    return acc;
  },
  {} as Record<string, string>,
);
const roleObj = countryData.reduce(
  (acc, currValue) => {
    const value = `role${currValue.locale.charAt(0).toUpperCase()}${currValue.locale.slice(1)}`;
    acc[currValue.language] = value;
    return acc;
  },
  {} as Record<string, string>,
);
const reimburismentObj = countryData.reduce(
  (acc, currValue) => {
    const value = `reimbursement${currValue.countryCode.charAt(0).toUpperCase()}${currValue.countryCode.slice(1)}`;
    acc[currValue.language] = value;
    return acc;
  },
  {} as Record<string, string>,
);

const handleFileSetter = ({
  e,
  imageSetter,
  setIsModalActive,
}: {
  e: React.ChangeEvent<HTMLInputElement>;
  imageSetter: React.Dispatch<React.SetStateAction<any>>;
  setIsModalActive?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (e.target.files && e.target.files.length > 0) {
    const image = e.target.files[0];
    if (image) {
      imageSetter(image);
      if (setIsModalActive) {
        setIsModalActive(true);
      }
    }
  }
};
const handleMultipleFileSetter = ({
  totalFiles,
  imageSetter,
  setIsModalActive,
}: {
  totalFiles: File[];
  imageSetter: React.Dispatch<React.SetStateAction<any>>;
  setIsModalActive?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (totalFiles && totalFiles.length > 0) {
    imageSetter(totalFiles);
    if (setIsModalActive) {
      setIsModalActive(true);
    }
  }
};

export {
  ACCEPT,
  ACCEPTED,
  convertToValidCurrency,
  countryData,
  genderObject,
  handleFileSetter,
  handleGetLocalStorage,
  handleMultipleFileSetter,
  handleRemoveFromLocalStorage,
  handleSetLocalStorage,
  hospitalDescObj,
  HospitalDescSchema,
  hospitalProcedureDescObj,
  positionObj,
  PositionSchema,
  ProcedureDescSchema,
  procedureObj,
  ProcedureSchema,
  qualificationObj,
  QualificationSchema,
  reimburismentObj,
  ReimbursementSchema,
  REJECT,
  REJECTED,
  REQUESTED,
  roleObj,
  RoleSchema,
  SERVER_ERROR_MESSAGE,
  subCategoryObj,
  SubCategorySchema,
};
