<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Trash from './Trash.svelte';
	import Palette from './Palette.svelte';
	import PersonIcon from './PersonIcon.svelte';
	import CollapsibleCard from './CollapsibleCard.svelte';
	import {
		addPerson as addPersonRaw,
		removePerson as removePersonRaw,
		updatePersonColor as updatePersonColorRaw
	} from '$lib/model';
	import { model } from '$lib/stores';

	export let collapsed: boolean;

	let value = '';

	function addPerson() {
		if (value === '') return;
		model.update((model) => addPersonRaw(model, value));
		value = '';
		const inputBox = document.getElementById('personInputBox');
		inputBox && inputBox.focus();
	}

	function removePerson(index: number) {
		model.update((model) => removePersonRaw(model, index));
	}

	function updatePersonColor(index: number) {
		model.update((model) => updatePersonColorRaw(model, index));
	}
</script>

<CollapsibleCard title="Who's on the bill?" bind:collapsed>
	<form class="flex space-x-2" on:submit|preventDefault={addPerson}>
		<Input bind:value placeholder="Billy Splits" id="personInputBox" />
		<Button variant="secondary" class="shrink-0" on:click={addPerson}>Add</Button>
	</form>
	<Separator class="my-3" />
	{#if $model.people.length === 0}
		<div class="flex items-center space-x-4">
			<Skeleton class="h-9 w-9 rounded-full" />
			<div class="space-y-2">
				<Skeleton class="h-3 w-[250px]" />
				<Skeleton class="h-3 w-[200px]" />
			</div>
		</div>
	{/if}
	<div class="grid gap-2">
		{#each $model.people as person, index}
			<div class="flex items-center justify-between space-x-4">
				<div class="flex items-center space-x-4">
					<PersonIcon {person} />
					<div>
						<p class="text-sm font-medium leading-none">
							{person.name}
						</p>
					</div>
				</div>
				<div class="flex items-center space-x-2">
					<Palette action={() => updatePersonColor(index)} />
					<Trash action={() => removePerson(index)} />
				</div>
			</div>
		{/each}
	</div>
</CollapsibleCard>
