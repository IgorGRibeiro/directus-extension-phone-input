import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';
import { buildCountryList } from '../utils/phone-utils.js';

const countryChoices = buildCountryList();

const storageFormatChoices = [
	{ text: 'E.164 (+12133734253)', value: 'e164' },
	{ text: 'Digits only (12133734253)', value: 'digits' },
];

export default defineInterface({
	id: 'phone-input',
	name: 'Phone',
	icon: 'phone',
	description: 'Phone number input with country selector, as-you-type formatting, validation, and configurable storage formats.',
	component: InterfaceComponent as unknown as never,
	options: [
		{
			field: 'defaultCountry',
			name: 'Default country',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: countryChoices,
				},
				conditions: [
					{
						name: 'Required when country selector is disabled',
						rule: { showCountrySelector: { _eq: false } },
						required: true,
					},
				],
			},
			schema: {
				default_value: 'US',
			},
		},
		{
			field: 'showCountrySelector',
			name: 'Show country selector',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
			},
			schema: {
				default_value: true,
			},
		},
		{
			field: 'enableFormatting',
			name: 'Format as you type',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
			},
			schema: {
				default_value: true,
			},
		},
		{
			field: 'storageFormat',
			name: 'Storage format',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: storageFormatChoices,
				},
			},
			schema: {
				default_value: 'e164',
			},
		},
		{
			field: 'enableValidation',
			name: 'Validate number',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
			},
			schema: {
				default_value: false,
			},
		},
	],
	types: ['string'],
});
