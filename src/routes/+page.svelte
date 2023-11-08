<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import PeoplePicker from '$lib/components/PeoplePicker.svelte';
	import BillPicker from '$lib/components/BillPicker.svelte';
	import TotalPicker from '$lib/components/TotalPicker.svelte';
	import type { Person, Row } from '$lib/utils';

	let peoplePickerCollapsed = false;
	let billPickerCollapsed = false;
	let people: Person[] = [];
	let rows: Row[] = [];
</script>

<div class="grid gap-3 rounded-sm p-3 max-w-3xl mx-auto">
	<Title />
	<PeoplePicker bind:people bind:collapsed={peoplePickerCollapsed} />
	<BillPicker
		bind:people
		bind:rows
		bind:collapsed={billPickerCollapsed}
		bind:priorCollapsed={peoplePickerCollapsed}
	/>
	<TotalPicker bind:people bind:rows bind:priorCollapsed={billPickerCollapsed} />
	<p class="mt-auto text-xs text-gray-800 opacity-90">
		Inspired by jack britton's <a
			href="https://www.jackbritton.me/billysplits/index.html"
			target="_blank"
			class="text-purple-800 underline">website</a
		>.
	</p>
</div>
