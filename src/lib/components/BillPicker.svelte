<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import {
		hasUnassignedRows,
		togglePersonActive,
		addRow as addRowRaw,
		removeRow as removeRowRaw
	} from '$lib/model';
	import { model } from '$lib/stores';
	import PersonIcon from './PersonIcon.svelte';
	import Trash from './Trash.svelte';
	import CollapsibleCard from './CollapsibleCard.svelte';

	export let collapsed: boolean;
	export let priorCollapsed: boolean;

	function changeActive(index: number, person: string) {
		model.update((model) => togglePersonActive(model, index, person));
	}

	let value = '';
	function addRow() {
		if (value === '' || !parseFloat(value)) return;

		model.update((model) => addRowRaw(model, parseFloat(value)));
		value = '';
		const inputBox = document.getElementById('billInputBox');
		inputBox && inputBox.focus();
	}

	function deleteRow(index: number) {
		model.update((model) => removeRowRaw(model, index));
	}
</script>

<CollapsibleCard
	title="What were the bill items?"
	description="Don't include tip or tax, we'll get to that later"
	bind:collapsed
	also={$model.people.length > 0}
>
	{#if $model.rows.length === 0}
		<div class="flex items-center space-x-4">
			<Skeleton class="h-9 w-9 rounded-full" />
			<div class="space-y-2">
				<Skeleton class="h-3 w-[250px]" />
				<Skeleton class="h-3 w-[200px]" />
			</div>
		</div>
	{/if}
	<div class="grid gap-2">
		<div class="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
			{#each $model.rows as row, index}
				{@const rowEmpty = row.actives.size == 0}
				<div>
					<p class={'text-sm font-medium leading-none' + (rowEmpty ? ' text-red-700' : '')}>
						${row.amount + (rowEmpty ? '*' : '')}
					</p>
				</div>
				<div class="flex items-center space-x-2">
					{#each $model.people as person}
						<button on:click={() => changeActive(index, person.name)}>
							<PersonIcon {person} active={row.actives.includes(person.name)} />
						</button>
					{/each}
				</div>
				<div>
					<Trash action={() => deleteRow(index)} />
				</div>
			{/each}
		</div>
	</div>
	<Separator class="my-3" />
	<form class="flex space-x-2" on:submit|preventDefault={addRow}>
		<Input
			bind:value
			type="text"
			inputmode="decimal"
			pattern={'[0-9]*\\.?[0-9]{0,2}'}
			placeholder="$0.00"
			id="billInputBox"
			min={0.01}
			step={0.01}
			on:focus={() => (priorCollapsed = true)}
		/>
		<Button variant="secondary" class="shrink-0" on:click={addRow}>Add</Button>
	</form>
	{#if hasUnassignedRows($model)}
		<p class="text-xs text-red-700 mt-2 -mb-3">Some rows are unassigned!</p>
	{/if}
</CollapsibleCard>
