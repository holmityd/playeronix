<script>
	import IconButton from './IconButton.svelte';
	import { Pause, Play } from 'svelte-hero-icons';
	import { togglePlay } from '../services/player.service.js';
	import { videoPausedStore } from '../stores/player.store.js';
	import { writable } from 'svelte/store';

	// Stores
	const tooltipText = writable();
	const icon = writable();
	$: if ($videoPausedStore) {
		tooltipText.set('Play');
		icon.set(Play);
	} else {
		tooltipText.set('Pause');
		icon.set(Pause);
	}
</script>

<IconButton on:click={() => togglePlay()} {icon} {tooltipText} />
