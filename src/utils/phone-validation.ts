import type { TFunction } from 'i18next';
import type { CountryCode } from 'libphonenumber-js';

import parsePhoneNumberFromString from 'libphonenumber-js';

/**
 * Extracts the national number from a phone number string
 * @param phoneNumber - The full phone number (with or without country code)
 * @param countryCode - The ISO country code (e.g., "EG", "SA", "US")
 * @returns The national number without country code and leading zeros
 */
export const extractNationalNumber = (phoneNumber: string, countryCode: CountryCode): string => {
  if (!phoneNumber || !countryCode) {
    return phoneNumber || '';
  }

  try {
    const parsedPhone = parsePhoneNumberFromString(phoneNumber, countryCode);

    if (parsedPhone && parsedPhone.isValid()) {
      return parsedPhone.nationalNumber;
    }
    return phoneNumber.replace(/^0/, '');
  } catch {
    return phoneNumber.replace(/^0/, '');
  }
};

/**
 * Formats a phone number for display
 * @param phoneNumber - The phone number to format
 * @param countryCode - The ISO country code
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string, countryCode: CountryCode): string => {
  if (!phoneNumber || !countryCode) {
    return phoneNumber || '';
  }

  try {
    const parsedPhone = parsePhoneNumberFromString(phoneNumber, countryCode);

    if (parsedPhone && parsedPhone.isValid()) {
      return parsedPhone.formatNational();
    }

    return phoneNumber;
  } catch {
    return phoneNumber;
  }
};

/**
 * Validates a phone number against a country code
 * @param phoneNumber - The phone number to validate
 * @param countryCode - The ISO country code (e.g., "EG", "SA", "US")
 * @param t - The translation function
 * @returns Object with isValid boolean and optional error message
 */
export const validatePhoneNumber = (
  phoneNumber: string,
  countryCode: CountryCode,
  t: TFunction
): { isValid: boolean; error?: string } => {
  if (!phoneNumber) {
    return { isValid: false, error: t('profile.validation.phoneRequired') };
  }

  if (!countryCode) {
    return { isValid: false, error: t('profile.validation.countryCodeRequired') };
  }
  if (countryCode === 'EG' && phoneNumber.length !== 11) {
    return { isValid: false, error: t('profile.validation.phoneInvalid') };
  }
  try {
    const parsedPhone = parsePhoneNumberFromString(phoneNumber, countryCode);

    if (!parsedPhone) {
      return { isValid: false, error: t('profile.validation.phoneInvalid') };
    }

    if (!parsedPhone.isValid()) {
      return { isValid: false, error: t('profile.validation.phoneInvalid') };
    }

    if (!parsedPhone.isPossible()) {
      return { isValid: false, error: t('profile.validation.phoneInvalid') };
    }

    // Check if the phone number's country code matches the selected country
    if (parsedPhone.country !== countryCode) {
      return { isValid: false, error: t('profile.validation.phoneCountryMismatch') };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: t('profile.validation.phoneInvalid') };
  }
};
