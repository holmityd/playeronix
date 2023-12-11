<script>
	import { Icon } from 'svelte-hero-icons';
	import { tooltip } from '../directives/tooltip.directive.js';

	// Props
	export let icon;
	export let tooltipText;
	export let ariaLabel = '';
</script>

<button
	class="w-10 h-10 flex items-center justify-center outline-none text-white hover:bg-gray-600/50 hover:shadow transition-all duration-200"
	on:click
	use:tooltip={{ tooltipText }}
	aria-label={$tooltipText ? $tooltipText : ariaLabel}
>
	<Icon src={$icon} size="20" />
</button>
