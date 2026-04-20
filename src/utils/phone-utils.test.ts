import { describe, it, expect } from 'vitest';
import {
	buildCountryList,
	parseStoredPhone,
	formatForStorage,
	formatForDisplay,
	validatePhone,
	isTooLongForCountry,
} from './phone-utils.js';

describe('buildCountryList', () => {
	it('returns a non-empty array', () => {
		const list = buildCountryList();
		expect(list.length).toBeGreaterThan(0);
	});

	it('items have text and value shape', () => {
		const list = buildCountryList();
		const item = list[0];
		expect(item).toHaveProperty('text');
		expect(item).toHaveProperty('value');
	});

	it('includes BR and US', () => {
		const list = buildCountryList();
		const codes = list.map((i) => i.value);
		expect(codes).toContain('BR');
		expect(codes).toContain('US');
	});

	it('BR entry has correct format in English', () => {
		const list = buildCountryList();
		const br = list.find((i) => i.value === 'BR');
		expect(br!.text).toBe('Brazil (+55)');
	});

	it('localizes country names when locale provided', () => {
		const list = buildCountryList('pt');
		const br = list.find((i) => i.value === 'BR');
		expect(br!.text).toBe('Brasil (+55)');
	});

	it('list is sorted alphabetically by localized name', () => {
		const list = buildCountryList();
		const texts = list.map((i) => i.text);
		const sorted = [...texts].sort((a, b) => a.localeCompare(b, 'en'));
		expect(texts).toEqual(sorted);
	});
});

describe('parseStoredPhone', () => {
	it('parses E.164 number', () => {
		const result = parseStoredPhone('+12133734253', 'US');
		expect(result).not.toBeNull();
		expect(result!.country).toBe('US');
		expect(result!.nationalNumber).toBe('2133734253');
	});

	it('parses international format', () => {
		const result = parseStoredPhone('+1 213 373 4253', 'US');
		expect(result).not.toBeNull();
		expect(result!.country).toBe('US');
	});

	it('parses national number with defaultCountry', () => {
		const result = parseStoredPhone('11987654321', 'BR');
		expect(result).not.toBeNull();
		expect(result!.country).toBe('BR');
	});

	it('returns null for invalid input', () => {
		expect(parseStoredPhone('abc', 'US')).toBeNull();
	});

	it('returns null for empty string', () => {
		expect(parseStoredPhone('', 'US')).toBeNull();
	});

	it('returns null for null', () => {
		expect(parseStoredPhone(null, 'US')).toBeNull();
	});

	it('returns parsedPhone with correct type', () => {
		const result = parseStoredPhone('+12133734253', 'US');
		expect(result!.parsedPhone).toBeDefined();
		expect(typeof result!.parsedPhone.formatInternational).toBe('function');
	});
});

describe('formatForStorage', () => {
	const parsedUS = parseStoredPhone('+12133734253', 'US')!.parsedPhone;

	it('formats as international', () => {
		expect(formatForStorage(parsedUS, 'international')).toBe('+1 213 373 4253');
	});

	it('formats as e164', () => {
		expect(formatForStorage(parsedUS, 'e164')).toBe('+12133734253');
	});

	it('formats as national', () => {
		expect(formatForStorage(parsedUS, 'national')).toBe('(213) 373-4253');
	});

	it('formats as digits only', () => {
		expect(formatForStorage(parsedUS, 'digits')).toBe('12133734253');
	});

	it('defaults to international for unknown format', () => {
		expect(formatForStorage(parsedUS, undefined)).toBe('+1 213 373 4253');
	});
});

describe('formatForDisplay', () => {
	it('formats E.164 as international', () => {
		const result = formatForDisplay('+12133734253', 'US', 'international');
		expect(result).toBe('+1 213 373 4253');
	});

	it('formats E.164 as national', () => {
		const result = formatForDisplay('+12133734253', 'US', 'national');
		expect(result).toBe('(213) 373-4253');
	});

	it('formats E.164 as e164', () => {
		const result = formatForDisplay('+12133734253', 'US', 'e164');
		expect(result).toBe('+12133734253');
	});

	it('formats E.164 as digits', () => {
		const result = formatForDisplay('+12133734253', 'US', 'digits');
		expect(result).toBe('12133734253');
	});

	it('returns null for invalid input', () => {
		expect(formatForDisplay('not-a-phone', 'US', 'international')).toBeNull();
	});

	it('returns null for empty string', () => {
		expect(formatForDisplay('', 'US', 'international')).toBeNull();
	});

	it('returns null for null', () => {
		expect(formatForDisplay(null, 'US', 'international')).toBeNull();
	});
});

describe('isTooLongForCountry', () => {
	it('returns false for a valid BR mobile (11 digits)', () => {
		expect(isTooLongForCountry('11987654321', 'BR')).toBe(false);
	});

	it('returns false for a valid BR landline (10 digits)', () => {
		expect(isTooLongForCountry('3298888444', 'BR')).toBe(false);
	});

	it('returns true when one digit over BR max', () => {
		expect(isTooLongForCountry('329888844445', 'BR')).toBe(true);
	});

	it('returns false for a valid US number (10 digits)', () => {
		expect(isTooLongForCountry('2133734253', 'US')).toBe(false);
	});

	it('returns true when US number exceeds max', () => {
		expect(isTooLongForCountry('21337342530000', 'US')).toBe(true);
	});

	it('returns false when country is missing', () => {
		expect(isTooLongForCountry('999999999999', '')).toBe(false);
	});

	it('returns false for empty digits', () => {
		expect(isTooLongForCountry('', 'BR')).toBe(false);
	});
});

describe('validatePhone', () => {
	it('returns true for valid US number in E.164', () => {
		expect(validatePhone('+12133734253', 'US')).toBe(true);
	});

	it('returns true for valid BR number in E.164', () => {
		expect(validatePhone('+5511987654321', 'BR')).toBe(true);
	});

	it('returns false for too-short number', () => {
		expect(validatePhone('123', 'US')).toBe(false);
	});

	it('returns false for garbage string', () => {
		expect(validatePhone('notaphone', 'US')).toBe(false);
	});

	it('returns false for null', () => {
		expect(validatePhone(null, 'US')).toBe(false);
	});

	it('returns false for empty string', () => {
		expect(validatePhone('', 'US')).toBe(false);
	});
});
