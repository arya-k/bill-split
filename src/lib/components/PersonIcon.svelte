<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import type { Person } from '$lib/model';

	function initials({ name }: Person): string {
		return name
			.split(' ')
			.map((w) => w[0])
			.join('');
	}

	export let person: Person;
	export let active: boolean = true;
	export let action: () => void = () => {};
</script>

<button on:click={action} on:keypress={action}>
	<Tooltip.Root openDelay={50}>
		<Tooltip.Trigger>
			<Avatar.Root>
				<Avatar.Fallback
					class={active ? 'border-solid border-2 border-gray-600' : 'opacity-20'}
					style="background-color:{person.color}">{initials(person)}</Avatar.Fallback
				></Avatar.Root
			>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>{person.name}</p>
		</Tooltip.Content>
	</Tooltip.Root>
</button>
