<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { ChevronDown } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	export let title: string;
	export let collapsed: boolean;
	export let also: boolean = true; // Additional factor that must be true.
</script>

<Card.Root>
	<Card.Header>
		<button on:click={() => (collapsed = !collapsed)}>
			<div class="flex justify-between">
				<Card.Title>{title}</Card.Title>
				<ChevronDown class="h-6 w-6 text-purple-800" />
			</div>
		</button>
	</Card.Header>
	{#if !collapsed && also}
		<div transition:slide>
			<Card.Content>
				<slot />
			</Card.Content>
		</div>
	{/if}
</Card.Root>
