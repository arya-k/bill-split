<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import PeoplePicker from '$lib/components/PeoplePicker.svelte';
	import BillPicker from '$lib/components/BillPicker.svelte';
	import type { Person } from '$lib/utils';

	let peoplePickerCollapsed = false;
	let people: Person[] = [];
</script>

<!-- TODO: max width. Center within it. -->
<!-- TODO: better name than billy splits -->
<div class="grid gap-3 rounded-sm p-3 md:grid">
	<Title />
	<PeoplePicker bind:people bind:collapsed={peoplePickerCollapsed} />
	<BillPicker bind:people bind:priorCollapsed={peoplePickerCollapsed} />
</div>
