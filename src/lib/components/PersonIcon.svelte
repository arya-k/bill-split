<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Tooltip from '$lib/components/ui/tooltip';

	import type { Person } from '$lib/utils';

	function initials({ name }: Person): string {
		return name
			.split(' ')
			.map((w) => w[0])
			.join('');
	}

	export let person: Person;
	let className: string = '';
	export { className as class };
</script>

<Tooltip.Root openDelay={50}>
	<Tooltip.Trigger>
		<Avatar.Root>
			<Avatar.Fallback class={className} style="background-color:{person.color}"
				>{initials(person)}</Avatar.Fallback
			></Avatar.Root
		>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>{person.name}</p>
	</Tooltip.Content>
</Tooltip.Root>
