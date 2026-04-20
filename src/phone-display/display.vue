<template>
	<span class="phone-display">{{ formatted }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatForDisplay } from '../utils/phone-utils.js';

const props = withDefaults(defineProps<{
	value?: string | null;
	defaultCountry?: string;
	displayFormat?: string;
}>(), {
	value: null,
	defaultCountry: 'BR',
	displayFormat: 'international',
});

const formatted = computed(() =>
	props.value
		? formatForDisplay(props.value, props.defaultCountry, props.displayFormat) ?? '—'
		: '—'
);
</script>

<style scoped>
.phone-display {
	font-family: var(--theme--fonts--display--font-family);
}
</style>
