import { defineDisplay } from '@directus/extensions-sdk';
import DisplayComponent from './display.vue';
import { buildCountryList } from '../utils/phone-utils.js';

const countryChoices = buildCountryList();

const displayFormatChoices = [
	{ text: 'International (+1 213 373 4253)', value: 'international' },
	{ text: 'E.164 (+12133734253)', value: 'e164' },
	{ text: 'National ((213) 373-4253)', value: 'national' },
	{ text: 'Digits only (12133734253)', value: 'digits' },
];

export default defineDisplay({
	id: 'phone-display',
	name: 'Phone',
	icon: 'phone',
	description: 'Displays formatted phone numbers.',
	component: DisplayComponent as unknown as never,
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
			},
			schema: {
				default_value: 'US',
			},
		},
		{
			field: 'displayFormat',
			name: 'Display format',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: displayFormatChoices,
				},
			},
			schema: {
				default_value: 'international',
			},
		},
	],
	types: ['string'],
});
