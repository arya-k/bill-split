<script lang="ts">
	import { Palette } from 'lucide-svelte';

	export let action: () => void;
</script>

<div on:click={() => action()} on:keypress={() => action()} role="button" tabindex="0">
	<Palette class="h-5 w-5 text-purple-800" />
</div>
