import { describe, it, expect } from 'vitest';
import { resolveLocale } from './locale.js';

describe('resolveLocale', () => {
	it('returns base language from a hyphenated locale', () => {
		expect(resolveLocale('en-US')).toBe('en');
	});

	it('returns base language from a hyphenated locale (pt-BR)', () => {
		expect(resolveLocale('pt-BR')).toBe('pt');
	});

	it('lowercases a bare language code', () => {
		expect(resolveLocale('EN')).toBe('en');
	});

	it('returns the input lowercased when no hyphen is present', () => {
		expect(resolveLocale('fr')).toBe('fr');
	});

	it('handles multiple hyphens by taking only the first segment', () => {
		expect(resolveLocale('zh-Hant-TW')).toBe('zh');
	});

	it('returns "en" for an empty string', () => {
		expect(resolveLocale('')).toBe('en');
	});

	it('preserves zh-CN as a full-locale exception', () => {
		expect(resolveLocale('zh-CN')).toBe('zh-CN');
	});

	it('preserves zh-TW as a full-locale exception', () => {
		expect(resolveLocale('zh-TW')).toBe('zh-TW');
	});

	it('preserves sr-SP as a full-locale exception', () => {
		expect(resolveLocale('sr-SP')).toBe('sr-SP');
	});

	it('preserves sr-CS as a full-locale exception', () => {
		expect(resolveLocale('sr-CS')).toBe('sr-CS');
	});
});
