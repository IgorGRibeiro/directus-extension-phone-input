import {
	getCountries,
	getCountryCallingCode,
	parsePhoneNumberWithError,
	isValidPhoneNumber,
	validatePhoneNumberLength,
	type CountryCode,
	type PhoneNumber,
} from 'libphonenumber-js';

export interface CountryOption {
	text: string;
	value: string;
}

export interface ParsedPhone {
	country: CountryCode | undefined;
	nationalNumber: string;
	parsedPhone: PhoneNumber;
}

export function buildCountryList(locale = 'en'): CountryOption[] {
	let displayNames: Intl.DisplayNames | null = null;
	try {
		displayNames = new Intl.DisplayNames([locale], { type: 'region' });
	} catch {
		displayNames = null;
	}

	return getCountries()
		.map((country) => ({
			text: `${displayNames?.of(country) ?? country} (+${getCountryCallingCode(country)})`,
			value: country,
		}))
		.sort((a, b) => a.text.localeCompare(b.text, locale));
}

export function parseStoredPhone(
	value: string | null | undefined,
	defaultCountry?: string
): ParsedPhone | null {
	if (!value) return null;
	try {
		const parsed = parsePhoneNumberWithError(String(value), {
			defaultCountry: defaultCountry as CountryCode | undefined,
		});
		return {
			country: parsed.country,
			nationalNumber: parsed.nationalNumber,
			parsedPhone: parsed,
		};
	} catch {
		return null;
	}
}

export function formatForStorage(parsedPhone: PhoneNumber, storageFormat?: string): string {
	switch (storageFormat) {
		case 'e164':
			return parsedPhone.format('E.164');
		case 'national':
			return parsedPhone.formatNational();
		case 'digits':
			return parsedPhone.format('E.164').replace(/\D/g, '');
		case 'international':
		default:
			return parsedPhone.formatInternational();
	}
}

export function formatForDisplay(
	value: string | null | undefined,
	defaultCountry?: string,
	displayFormat?: string
): string | null {
	const parsed = parseStoredPhone(value, defaultCountry);
	if (!parsed) return null;
	return formatForStorage(parsed.parsedPhone, displayFormat);
}

export function isTooLongForCountry(digits: string, country?: string): boolean {
	if (!digits || !country) return false;
	try {
		return validatePhoneNumberLength(digits, country as CountryCode) === 'TOO_LONG';
	} catch {
		return false;
	}
}

export function validatePhone(value: string | null | undefined, country?: string): boolean {
	if (!value) return false;
	try {
		return isValidPhoneNumber(String(value), country as CountryCode | undefined);
	} catch {
		return false;
	}
}
