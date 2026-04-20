import { describe, it, expect } from 'vitest';
import { messages } from './index.js';

const EXPECTED_LOCALES = [
	'af', 'ar', 'az', 'bg', 'bn', 'bs', 'ca', 'cs', 'da', 'de',
	'el', 'en', 'eo', 'es', 'et', 'fa', 'fi', 'fr', 'gl', 'he',
	'hr', 'hu', 'id', 'is', 'it', 'ja', 'ka', 'km', 'ko', 'lt',
	'lv', 'mk', 'mn', 'ms', 'nb', 'nl', 'no', 'pl', 'pt', 'ro',
	'ru', 'sk', 'sl', 'sq', 'sv', 'sw', 'th', 'tl', 'tr', 'uk',
	'ur', 'uz', 'vi', 'zh-CN', 'zh-TW', 'sr-SP', 'sr-CS',
];

const REQUIRED_KEYS = ['invalid_phone_number'];

describe('i18n messages barrel', () => {
	it('exports every expected locale', () => {
		for (const locale of EXPECTED_LOCALES) {
			expect(messages, `missing locale: ${locale}`).toHaveProperty(locale);
		}
	});

	it('does not export unexpected locales', () => {
		const exported = Object.keys(messages).sort();
		const expected = [...EXPECTED_LOCALES].sort();
		expect(exported).toEqual(expected);
	});

	it('every locale contains all required keys with non-empty string values', () => {
		for (const [locale, bundle] of Object.entries(messages)) {
			for (const key of REQUIRED_KEYS) {
				const value = (bundle as Record<string, unknown>)[key];
				expect(typeof value, `${locale}.${key} should be a string`).toBe('string');
				expect((value as string).trim().length, `${locale}.${key} must be non-empty`).toBeGreaterThan(0);
			}
		}
	});

	it('no locale bundle has keys beyond the required set', () => {
		for (const [locale, bundle] of Object.entries(messages)) {
			const keys = Object.keys(bundle as Record<string, unknown>).sort();
			expect(keys, `unexpected keys in ${locale}`).toEqual([...REQUIRED_KEYS].sort());
		}
	});

	it('English source matches the canonical value', () => {
		expect((messages.en as Record<string, string>).invalid_phone_number).toBe(
			'Invalid phone number.'
		);
	});
});
