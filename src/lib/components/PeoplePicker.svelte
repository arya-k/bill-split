<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';

	import { type Person, pastels } from '$lib/utils';
	import Trash from './Trash.svelte';
	import PersonIcon from './PersonIcon.svelte';
	import CollapsibleCard from './CollapsibleCard.svelte';

	export let people: Person[];
	export let collapsed: boolean;

	let value = '';
	let nextPastel = 0;

	function addPerson() {
		if (value === '') return;

		let color = pastels[nextPastel % pastels.length];
		nextPastel += 1;

		people = [...people, { name: value, color }];
		value = '';
		const inputBox = document.getElementById('personInputBox');
		inputBox && inputBox.focus();
	}

	function deletePerson(index: number) {
		people = people.filter((_, i) => i !== index);
	}
</script>

<CollapsibleCard title="Who's on the bill?" bind:collapsed>
	<form class="flex space-x-2" on:submit|preventDefault={addPerson}>
		<Input bind:value placeholder="Billy Splits" id="personInputBox" />
		<Button variant="secondary" class="shrink-0" on:click={addPerson}>Add</Button>
	</form>
	<Separator class="my-3" />
	{#if people.length === 0}
		<div class="flex items-center space-x-4">
			<Skeleton class="h-9 w-9 rounded-full" />
			<div class="space-y-2">
				<Skeleton class="h-3 w-[250px]" />
				<Skeleton class="h-3 w-[200px]" />
			</div>
		</div>
	{/if}
	<div class="grid gap-2">
		{#each people as person, index}
			<div class="flex items-center justify-between space-x-4">
				<div class="flex items-center space-x-4">
					<PersonIcon {person} />
					<div>
						<p class="text-sm font-medium leading-none">
							{person.name}
						</p>
					</div>
				</div>
				<Trash action={() => deletePerson(index)} />
			</div>
		{/each}
	</div>
</CollapsibleCard>
