<script>
	import { onMount } from 'svelte';
	import { formatTime, manageEventListeners } from '../services/player.service.js';
	import { videoElmStore } from '../stores/player.store.js';

	$: video = $videoElmStore;

	// Time update
	let currentTime = 0;
	let duration = 0;
	function updateTimeline() {
		currentTime = video.currentTime;
		duration = video.duration;
	}

	// Lifecycle hooks
	onMount(() => {
		updateTimeline();
		const removeListeners = manageEventListeners(
			video,
			['loadeddata', 'timeupdate'],
			updateTimeline
		);
		return () => removeListeners();
	});
</script>

<div class="flex text-xs space-x-2 items-center text-white">
	{#if duration}
		<span>{formatTime(currentTime)}</span>
		<span>/</span>
		<span>{formatTime(duration)}</span>
	{/if}
</div>
