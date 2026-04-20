<template>
	<div class="phone-input-wrapper">
		<div class="phone-input-container">
			<div v-if="showCountrySelector" class="country-wrapper">
				<v-select
					:model-value="selectedCountry"
					:items="countryList"
					show-deselect
					@update:model-value="handleCountryChange"
				/>
			</div>
			<div class="input-wrapper">
				<v-input
					ref="inputRef"
					:model-value="displayValue"
					:disabled="disabled"
					font-family="monospace"
					inputmode="tel"
					@update:model-value="handleInput"
					@blur="touched = true"
				/>
			</div>
		</div>
		<v-notice v-if="validationError" type="danger">
			{{ t('invalid_phone_number') }}
		</v-notice>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { AsYouType, type CountryCode } from 'libphonenumber-js';
import {
	buildCountryList,
	parseStoredPhone,
	formatForStorage,
	validatePhone,
	isTooLongForCountry,
} from '../utils/phone-utils.js';
import { useTranslation } from '../utils/use-translation.js';

const props = withDefaults(defineProps<{
	value?: string | null;
	disabled?: boolean;
	defaultCountry?: string;
	showCountrySelector?: boolean;
	enableFormatting?: boolean;
	storageFormat?: string;
	enableValidation?: boolean;
}>(), {
	value: null,
	disabled: false,
	defaultCountry: 'BR',
	showCountrySelector: true,
	enableFormatting: true,
	storageFormat: 'e164',
	enableValidation: false,
});

const emit = defineEmits<{ (e: 'input', value: string | null): void }>();

const { t, locale } = useTranslation();

const countryList = computed(() => buildCountryList(locale.value));
const selectedCountry = ref(props.defaultCountry || 'BR');
const phoneInput = ref('');
const lastEmittedValue = ref<string | null>(null);
const touched = ref(false);
const inputRef = ref<{ $el?: HTMLElement } | null>(null);

const effectiveCountry = computed(() => selectedCountry.value || props.defaultCountry || 'BR');

const displayValue = computed(() => {
	if (!phoneInput.value) return '';
	if (!props.enableFormatting) return phoneInput.value;
	return new AsYouType(effectiveCountry.value as CountryCode).input(phoneInput.value);
});

const validationError = computed(() => {
	if (!props.enableValidation || !touched.value || !phoneInput.value) return false;
	return !validatePhone(phoneInput.value, effectiveCountry.value);
});

watch(
	() => props.value,
	(newValue) => {
		if (newValue === lastEmittedValue.value) return;
		if (!newValue) {
			phoneInput.value = '';
			lastEmittedValue.value = null;
			return;
		}
		const parsed = parseStoredPhone(newValue, props.defaultCountry || 'BR');
		if (parsed) {
			selectedCountry.value = parsed.country || props.defaultCountry || 'BR';
			phoneInput.value = parsed.nationalNumber;
		}
	},
	{ immediate: true }
);

function handleCountryChange(newCountry: string | null): void {
	selectedCountry.value = newCountry ?? '';
	emitValue();
}

function handleInput(newValue: string | null): void {
	const raw = newValue ?? '';
	const prevDisplay = displayValue.value;
	const stripped = raw.replace(/\D/g, '');

	// Backspace landed on a formatting char (space/paren/dash): the raw shrank
	// but the digit count didn't. Interpret as "delete the last digit".
	if (raw.length < prevDisplay.length && stripped.length === phoneInput.value.length) {
		phoneInput.value = phoneInput.value.slice(0, -1);
		emitValue();
		syncInputDom();
		return;
	}

	const isAdding = stripped.length > phoneInput.value.length;
	if (isAdding && isTooLongForCountry(stripped, effectiveCountry.value)) {
		syncInputDom();
		return;
	}

	phoneInput.value = stripped;
	emitValue();

	// Vue skips DOM writes when the computed value is unchanged, so force-sync
	// the underlying <input> whenever the raw keystroke contained non-digits.
	if (stripped !== raw) syncInputDom();
}

function syncInputDom() {
	nextTick(() => {
		const el = inputRef.value?.$el?.querySelector?.('input');
		if (el && el.value !== displayValue.value) el.value = displayValue.value;
	});
}

function emitValue() {
	let result = null;
	if (phoneInput.value) {
		const parsed = parseStoredPhone(phoneInput.value, effectiveCountry.value);
		result = parsed
			? formatForStorage(parsed.parsedPhone, props.storageFormat)
			: phoneInput.value;
	}
	lastEmittedValue.value = result;
	emit('input', result);
}
</script>

<style scoped>
.phone-input-wrapper {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.phone-input-container {
	display: flex;
	gap: 8px;
}

.country-wrapper {
	flex: 0 0 150px;
}

.country-wrapper :deep(input) {
	text-overflow: ellipsis;
}

.input-wrapper {
	flex: 1;
	min-width: 0;
}
</style>
