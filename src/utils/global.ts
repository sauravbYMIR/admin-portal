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

const countryCodes = {
  Afghanistan: 'AF',
  Albania: 'AL',
  Algeria: 'DZ',
  Andorra: 'AD',
  Angola: 'AO',
  'Antigua and Barbuda': 'AG',
  Argentina: 'AR',
  Armenia: 'AM',
  Australia: 'AU',
  Austria: 'AT',
  Azerbaijan: 'AZ',
  Bahamas: 'BS',
  Bahrain: 'BH',
  Bangladesh: 'BD',
  Barbados: 'BB',
  Belarus: 'BY',
  Belgium: 'BE',
  Belize: 'BZ',
  Benin: 'BJ',
  Bhutan: 'BT',
  Bolivia: 'BO',
  'Bosnia and Herzegovina': 'BA',
  Botswana: 'BW',
  Brazil: 'BR',
  Brunei: 'BN',
  Bulgaria: 'BG',
  'Burkina Faso': 'BF',
  Burundi: 'BI',
  'Cabo Verde': 'CV',
  Cambodia: 'KH',
  Cameroon: 'CM',
  Canada: 'CA',
  'Central African Republic': 'CF',
  Chad: 'TD',
  Chile: 'CL',
  China: 'CN',
  Colombia: 'CO',
  Comoros: 'KM',
  'Congo (Congo-Brazzaville)': 'CG',
  'Costa Rica': 'CR',
  Croatia: 'HR',
  Cuba: 'CU',
  Cyprus: 'CY',
  'Czech Republic': 'CZ',
  'Democratic Republic of the Congo': 'CD',
  Denmark: 'DK',
  Djibouti: 'DJ',
  Dominica: 'DM',
  'Dominican Republic': 'DO',
  Ecuador: 'EC',
  Egypt: 'EG',
  'El Salvador': 'SV',
  'Equatorial Guinea': 'GQ',
  Eritrea: 'ER',
  Estonia: 'EE',
  Eswatini: 'SZ',
  Ethiopia: 'ET',
  Fiji: 'FJ',
  Finland: 'FI',
  France: 'FR',
  Gabon: 'GA',
  Gambia: 'GM',
  Georgia: 'GE',
  Germany: 'DE',
  Ghana: 'GH',
  Greece: 'GR',
  Grenada: 'GD',
  Guatemala: 'GT',
  Guinea: 'GN',
  'Guinea-Bissau': 'GW',
  Guyana: 'GY',
  Haiti: 'HT',
  Honduras: 'HN',
  Hungary: 'HU',
  Iceland: 'IS',
  India: 'IN',
  Indonesia: 'ID',
  Iran: 'IR',
  Iraq: 'IQ',
  Ireland: 'IE',
  Israel: 'IL',
  Italy: 'IT',
  Jamaica: 'JM',
  Japan: 'JP',
  Jordan: 'JO',
  Kazakhstan: 'KZ',
  Kenya: 'KE',
  Kiribati: 'KI',
  Kuwait: 'KW',
  Kyrgyzstan: 'KG',
  Laos: 'LA',
  Latvia: 'LV',
  Lebanon: 'LB',
  Lesotho: 'LS',
  Liberia: 'LR',
  Libya: 'LY',
  Liechtenstein: 'LI',
  Lithuania: 'LT',
  Luxembourg: 'LU',
  Madagascar: 'MG',
  Malawi: 'MW',
  Malaysia: 'MY',
  Maldives: 'MV',
  Mali: 'ML',
  Malta: 'MT',
  'Marshall Islands': 'MH',
  Mauritania: 'MR',
  Mauritius: 'MU',
  Mexico: 'MX',
  Micronesia: 'FM',
  Moldova: 'MD',
  Monaco: 'MC',
  Mongolia: 'MN',
  Montenegro: 'ME',
  Morocco: 'MA',
  Mozambique: 'MZ',
  'Myanmar (Burma)': 'MM',
  Namibia: 'NA',
  Nauru: 'NR',
  Nepal: 'NP',
  Netherlands: 'NL',
  'New Zealand': 'NZ',
  Nicaragua: 'NI',
  Niger: 'NE',
  Nigeria: 'NG',
  'North Korea': 'KP',
  'North Macedonia': 'MK',
  Norway: 'NO',
  Oman: 'OM',
  Pakistan: 'PK',
  Palau: 'PW',
  'Palestine State': 'PS',
  Panama: 'PA',
  'Papua New Guinea': 'PG',
  Paraguay: 'PY',
  Peru: 'PE',
  Philippines: 'PH',
  Poland: 'PL',
  Portugal: 'PT',
  Qatar: 'QA',
  Romania: 'RO',
  Russia: 'RU',
  Rwanda: 'RW',
  'Saint Kitts and Nevis': 'KN',
  'Saint Lucia': 'LC',
  'Saint Vincent and the Grenadines': 'VC',
  Samoa: 'WS',
  'San Marino': 'SM',
  'Sao Tome and Principe': 'ST',
  'Saudi Arabia': 'SA',
  Senegal: 'SN',
  Serbia: 'RS',
  Seychelles: 'SC',
  'Sierra Leone': 'SL',
  Singapore: 'SG',
  Slovakia: 'SK',
  Slovenia: 'SI',
  'Solomon Islands': 'SB',
  Somalia: 'SO',
  'South Africa': 'ZA',
  'South Korea': 'KR',
  'South Sudan': 'SS',
  Spain: 'ES',
  'Sri Lanka': 'LK',
  Sudan: 'SD',
  Suriname: 'SR',
  Sweden: 'SE',
  Switzerland: 'CH',
  Syria: 'SY',
  Taiwan: 'TW',
  Tajikistan: 'TJ',
  Tanzania: 'TZ',
  Thailand: 'TH',
  'Timor-Leste': 'TL',
  Togo: 'TG',
  Tonga: 'TO',
  'Trinidad and Tobago': 'TT',
  Tunisia: 'TN',
  Turkey: 'TR',
  Turkmenistan: 'TM',
  Tuvalu: 'TV',
  Uganda: 'UG',
  Ukraine: 'UA',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United States': 'US',
  Uruguay: 'UY',
  Uzbekistan: 'UZ',
  Vanuatu: 'VU',
  'Vatican City': 'VA',
  Venezuela: 'VE',
  Vietnam: 'VN',
  Yemen: 'YE',
  Zambia: 'ZM',
  Zimbabwe: 'ZW',
};

export {
  ACCEPT,
  ACCEPTED,
  countryCodes,
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
