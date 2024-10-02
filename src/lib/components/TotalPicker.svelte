<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import PersonIcon from './PersonIcon.svelte';
	import { model } from '$lib/stores';
	import { type Bill, calculateBill, isTotalLessThanSum } from '$lib/model';
	import { CheckCheck, Copy } from 'lucide-svelte';
	import CollapsibleCard from './CollapsibleCard.svelte';
	import { compressToEncodedURIComponent } from 'lz-string';

	export let priorCollapsed: boolean;
	export let collapsed = false;

	let detailedView = false;

	let recentlyCopied = false;
	let recentlyCopiedTimeout: number | undefined;

	function copyToClipboard(bill: Bill) {
		const text = Object.entries(bill)
			.map(([name, { cost, details }]) => {
				const suffix = detailedView && cost > 1e-6 ? ` = ${details}` : '';
				return `${name} owes $${cost.toFixed(2)}${suffix}`;
			})
			.join('\n');

		const query = compressToEncodedURIComponent(JSON.stringify($model));
		const url = `${window.location.origin}/?data=${query}`;
		navigator.clipboard.writeText(text + '\n' + '^ via billy splits' + '\n' + url);

		recentlyCopied = true; // debounce
		clearTimeout(recentlyCopiedTimeout);
		recentlyCopiedTimeout = setTimeout(() => (recentlyCopied = false), 500);
	}
</script>

<CollapsibleCard
	title="What was the total bill amount?"
	description="Including tip and tax"
	bind:collapsed
	also={$model.rows.length > 0}
>
	<Input
		bind:value={$model.total}
		type="text"
		inputmode="decimal"
		pattern={'[0-9]*\\.?[0-9]{0,2}'}
		id="totalInputBox"
		placeholder="$0.00"
		min={0.01}
		step={0.01}
		on:focus={(event) => (priorCollapsed = true)}
	/>
	{#if isTotalLessThanSum($model)}
		<p class="text-xs text-red-700 mt-2 -mb-3">Total is smaller than sum of lines</p>
	{/if}
	{#if parseFloat($model.total)}
		{@const bill = calculateBill($model)}
		<Separator class="my-3" />
		<div class="flex items-stretch flex-col space-y-2 sm:space-x-4 sm:flex-row">
			<div class="grid gap-2 flex-auto">
				{#each $model.people as person}
					<div class="flex items-center justify-between space-x-4">
						<div class="flex items-center space-x-4">
							<PersonIcon {person} />
							<div>
								<p class="text-sm leading-none">
									<span class="font-medium">{person.name}</span>
									owes <span class="font-mono">${bill[person.name].cost.toFixed(2)}</span>
								</p>
								{#if detailedView && bill[person.name].cost > 1e-6}
									<p class="text-xs font-mono">= {bill[person.name].details}</p>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="flex-none flex items-center space-x-2 text-purple-800 ml-auto -mt-8">
				<div class="flex items-center space-x-2">
					<Switch bind:checked={detailedView} id="detailed-mode" />
					<Label class="text-xs text-purple-800" for="detailed-mode">Detailed</Label>
				</div>
				<Button variant="ghost" on:click={() => copyToClipboard(bill)}>
					{#if recentlyCopied} <CheckCheck /> {:else} <Copy /> {/if}
				</Button>
			</div>
		</div>
	{/if}
</CollapsibleCard>
