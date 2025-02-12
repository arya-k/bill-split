<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import PeoplePicker from '$lib/components/PeoplePicker.svelte';
	import BillPicker from '$lib/components/BillPicker.svelte';
	import TotalPicker from '$lib/components/TotalPicker.svelte';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import pkg from 'lz-string';
	const { decompressFromEncodedURIComponent } = pkg;
	import type { Model } from '$lib/model';
	import { model } from '$lib/stores';

	let peoplePickerCollapsed = false;
	let billPickerCollapsed = false;

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const compressedData = urlParams.get('data');
		if (compressedData) {
			try {
				const jsonString = decompressFromEncodedURIComponent(compressedData);
				const modelData = JSON.parse(jsonString) as Model;

				console.log('About to set model', modelData);
				model.set(modelData);
			} catch (error) {
				console.error('Error decoding URL parameter:', error);
			}

			// Remove the query parameter from the URL
			goto(window.location.pathname, { replaceState: true });
		}
	});
</script>

<div class="grid gap-3 rounded-sm p-3 max-w-3xl mx-auto">
	<Title />
	<PeoplePicker bind:collapsed={peoplePickerCollapsed} />
	<BillPicker bind:collapsed={billPickerCollapsed} bind:priorCollapsed={peoplePickerCollapsed} />
	<TotalPicker bind:priorCollapsed={billPickerCollapsed} />
	<p class="mt-auto text-xs text-gray-800 opacity-90">
		Inspired by jack britton's <a
			href="https://www.jackbritton.me/billysplits/index.html"
			target="_blank"
			class="text-purple-800 underline">website</a
		>.
	</p>
</div>
