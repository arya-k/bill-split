<script>
	import { PiggyBank } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
</script>

<Alert.Root>
	<PiggyBank class="h-6 w-6" />
	<Alert.Title class="text-lg text-gray-800">Billy Splits</Alert.Title>
	<Alert.Description class="text-sm text-purple-800"
		>Enter in your bill, then get splits!</Alert.Description
	>
</Alert.Root>
