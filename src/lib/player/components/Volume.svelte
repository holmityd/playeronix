<script>
	import { onMount } from 'svelte';
	import IconButton from './IconButton.svelte';
	import { SpeakerWave, SpeakerXMark } from 'svelte-hero-icons';
	import { writable } from 'svelte/store';
	import { manageEventListeners, toggleMute } from '../services/player.service.js';
	import { videoElmStore } from '../stores/player.store.js';

	$: video = $videoElmStore;

	// Stores
	const tooltipText = writable();
	const icon = writable();
	$: if (volumeLevel) {
		tooltipText.set('Mute');
		icon.set(SpeakerWave);
	} else {
		tooltipText.set('Unmute');
		icon.set(SpeakerXMark);
	}

	// Volume slider
	let volumeLevel = 100;
	function applyVolumeToVideo() {
		try {
			if (!video) throw new Error('Failed to sync volume with video');
			video.volume = volumeLevel / 100;
			updateMuteStatusAndLocalStorage();
		} catch (error) {
			console.error(error.message);
		}
	}
	function syncVolumeWithVideo() {
		volumeLevel = video.volume * 100;
		updateMuteStatusAndLocalStorage();
	}

	// Events
	function updateMuteStatusAndLocalStorage() {
		video.muted = !video.volume;
		// localStorage.setItem(VIDEO_VOLUME, String(volumeLevel));
	}

	// Lifecycle hooks
	onMount(() => {
		const removeListeners = manageEventListeners(video, ['volumechange'], syncVolumeWithVideo);
		return () => removeListeners();
	});
</script>

<div class="group flex">
	<IconButton on:click={() => toggleMute()} {icon} {tooltipText} />
	<div class="items-center w-0 group-hover:w-24 transition-width duration-100 relative flex">
		<div class="mx-2 w-full h-1 rounded-sm overflow-hidden bg-gray-700">
			<input
				type="range"
				min="0"
				max="100"
				bind:value={volumeLevel}
				on:input={applyVolumeToVideo}
				class="w-full h-full opacity-0 appearance-none absolute top-0 left-0"
				tabindex="-1"
				aria-label="volume"
			/>
			<div
				class="h-full bg-green-500 transition-width duration-100"
				style={`width: ${volumeLevel}%`}
			/>
		</div>
	</div>
</div>
