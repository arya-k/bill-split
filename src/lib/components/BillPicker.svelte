<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import type { Person, Row } from '$lib/utils';
	import PersonIcon from './PersonIcon.svelte';
	import Trash from './Trash.svelte';
	import CollapsibleCard from './CollapsibleCard.svelte';

	export let people: Person[];
	export let rows: Row[];
	export let collapsed: boolean;
	export let priorCollapsed: boolean;

	function changeActive(index: number, person: string) {
		rows = rows.map((row, i) => {
			if (i !== index) return row;

			const actives = new Set<string>(row.actives);
			if (actives.has(person)) {
				actives.delete(person);
			} else {
				actives.add(person);
			}

			return { ...row, actives };
		});
	}

	let value = '';
	function addRow() {
		if (value === '') return;

		const row = {
			amount: parseFloat(value).toFixed(2),
			actives: new Set<string>()
		};

		rows = [...rows, row];
		value = '';
		const inputBox = document.getElementById('billInputBox');
		inputBox && inputBox.focus();
	}

	function deleteRow(index: number) {
		rows = rows.filter((_, i) => i !== index);
	}
</script>

<CollapsibleCard
	title="What were the bill items?"
	description="Don't include tip or tax, we'll get to that later"
	bind:collapsed
	also={people.length > 0}
>
	{#if rows.length === 0}
		<div class="flex items-center space-x-4">
			<Skeleton class="h-9 w-9 rounded-full" />
			<div class="space-y-2">
				<Skeleton class="h-3 w-[250px]" />
				<Skeleton class="h-3 w-[200px]" />
			</div>
		</div>
	{/if}
	<div class="grid gap-2">
		{#each rows as row, index}
			{@const rowEmpty = row.actives.size == 0}
			<div class="flex items-center justify-between space-x-4">
				<div class="flex items-center space-x-4">
					<p class={'text-sm font-medium leading-none' + (rowEmpty ? ' text-red-700' : '')}>
						${row.amount + (rowEmpty ? '*' : '')}
					</p>
				</div>
				<div class="flex items-center space-x-2">
					{#each people as person}
						<button on:click={() => changeActive(index, person.name)}>
							<PersonIcon
								{person}
								class={row.actives.has(person.name)
									? 'border-solid border-2 border-gray-700'
									: 'opacity-20'}
							/>
						</button>
					{/each}
					<Trash action={() => deleteRow(index)} />
				</div>
			</div>
		{/each}
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
	{#if rows.length > 0 && rows.some((row) => row.actives.size === 0)}
		<p class="text-xs text-red-700 mt-2 -mb-3">Some rows are unassigned!</p>
	{/if}
</CollapsibleCard>
