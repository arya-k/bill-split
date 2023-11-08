<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';

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

<Avatar.Root>
	<Avatar.Fallback class={className} style="background-color:{person.color}"
		>{initials(person)}</Avatar.Fallback
	>
</Avatar.Root>
