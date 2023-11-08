<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { slide } from 'svelte/transition';

	import { initials, type Person } from '$lib/utils';

	type Row = {
		amount: string;
		actives: Set<string>;
	};

	export let people: Person[];
	export let priorCollapsed: boolean;
	export let rows: Row[] = [];

	function changeActive(rowIndex: number, person: string) {
		rows = rows.map((row, i) => {
			if (i !== rowIndex) return row;

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

<!-- TODO: add a warning if a row has no one assigned to it! -->
<!-- TODO: scale icons, or have them roll around the width if they dont fit. -->
<!-- TODO: Animation for the circles when they are selected / unselected -->
<!-- TODO: Border for the circles when selected -->
<!-- TODO: change delete to trash can -->
<!-- TODO: Hide the arrows in the number input -->
<!-- TODO: On phone, should be numpad only -->

<Card.Root>
	<Card.Header>
		<Card.Title>What were the bill items?</Card.Title>
	</Card.Header>
	{#if people.length > 0}
		<div transition:slide>
			<Card.Content>
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
					{#each rows as row, rowIndex}
						<div class="flex items-center justify-between space-x-4">
							<div class="flex items-center space-x-4">
								<p class="text-sm font-medium leading-none">${row.amount}</p>
							</div>
							<div class="flex items-center space-x-2">
								{#each people as person, personIndex}
									{@const activeClass = row.actives.has(person.name) ? '' : 'opacity-20'}
									<div
										on:click={() => changeActive(rowIndex, person.name)}
										on:keypress={() => changeActive(rowIndex, person.name)}
										role="button"
										tabindex="0"
									>
										<Avatar.Root>
											<Avatar.Fallback
												class={activeClass}
												style="background-color:{people[personIndex].color}"
												>{initials(people[personIndex])}</Avatar.Fallback
											>
										</Avatar.Root>
									</div>
								{/each}
								<Button variant="link" on:click={() => deleteRow(rowIndex)}>delete</Button>
							</div>
						</div>
					{/each}
				</div>
				<Separator class="my-3" />
				<form class="flex space-x-2" on:submit|preventDefault={addRow}>
					<Input
						bind:value
						type="number"
						placeholder="0.00"
						id="billInputBox"
						min={0.01}
						step={0.01}
						on:focus={() => (priorCollapsed = true)}
					/>
					<Button variant="secondary" class="shrink-0" on:click={addRow}>Add</Button>
				</form>
			</Card.Content>
		</div>
	{/if}
</Card.Root>
