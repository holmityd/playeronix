<script>
	import { onMount } from 'svelte';
	import { canControlStore, controlsVisibleStore, videoElmStore } from '../stores/player.store.js';
	import {
		togglePlay,
		setVideoTime,
		controlDelayedHide,
		manageEventListeners,
		toggleMute
	} from '../services/player.service.js';
	import PlayButton from './PlayButton.svelte';
	import ProgressBar from './ProgressBar.svelte';
	import Volume from './Volume.svelte';
	import Timeline from './Timeline.svelte';
	import FullscreenButton from './FullscreenButton.svelte';
	import Loading from './Loading.svelte';

	// Props
	export let videoContainer;

	function handleKeyPress(event) {
		const activeElement = document.activeElement;
		const isInputFocused = activeElement && activeElement.tagName === 'INPUT';
		const keys = [' ', 'k', 'j', 'k', 'l', 'm', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
		if (!isInputFocused && keys.indexOf(event.key) != -1) {
			event.preventDefault();
			controlDelayedHide();
			switch (event.key) {
				case ' ':
				case 'k':
					togglePlay();
					break;
				case 'j':
					jump(-10);
					break;
				case 'l':
					jump(+10);
					break;
				case 'm':
					toggleMute();
					break;
				case 'ArrowLeft':
					jump(-5);
					break;
				case 'ArrowRight':
					jump(+5);
					break;
				case 'ArrowUp':
					adjustVolume(+0.1);
					break;
				case 'ArrowDown':
					adjustVolume(-0.1);
					break;
			}
		}
	}

	function jump(seconds) {
		const newTime = clamp($videoElmStore.currentTime + seconds, 0, $videoElmStore.duration);
		setVideoTime($videoElmStore, newTime >= 0 ? newTime : 0);
	}

	function adjustVolume(amount) {
		const newVolume = clamp($videoElmStore.volume + amount, 0, 1);
		$videoElmStore.volume = newVolume;
	}

	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	// Lifecycle hooks
	onMount(() => {
		const removeListeners = manageEventListeners(document, ['keydown'], handleKeyPress);
		return () => removeListeners();
	});
</script>

<button
	class="absolute w-full h-full outline-none {$controlsVisibleStore
		? 'cursor-default'
		: 'cursor-none'}"
	on:click={() => togglePlay()}
>
</button>

<Loading />

<div
	class="absolute left-0 w-full pt-0 pb-1 px-2 flex backdrop-blur bg-gray-700/50 {$controlsVisibleStore
		? 'bottom-0'
		: '-bottom-11'} transition-bottom duration-200"
>
	{#if $canControlStore}
		<PlayButton />
	{/if}
	<Volume />
	<Timeline />
	<span class="grow" />
	<FullscreenButton {videoContainer} />

	<div class="absolute bottom-0 left-0 w-full h-1 hover:h-1.5 transition-height duration-100">
		<ProgressBar />
	</div>
</div>
