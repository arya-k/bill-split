<script lang="ts">
	import { Trash } from 'lucide-svelte';

	export let action: () => void;
</script>

<div on:click={() => action()} on:keypress={() => action()} role="button" tabindex="0">
	<Trash class="h-5 w-5 text-purple-800" />
</div>
