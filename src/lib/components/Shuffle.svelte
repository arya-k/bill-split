<script lang="ts">
	import { Shuffle } from 'lucide-svelte';

	export let action: () => void;
</script>

<div on:click={() => action()} on:keypress={() => action()} role="button" tabindex="0">
	<Shuffle class="h-5 w-5 text-purple-800" />
</div>
