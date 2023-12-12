<script>
	import { onMount } from 'svelte';
	import { ArrowsPointingOut, ArrowsPointingIn } from 'svelte-hero-icons';
	import IconButton from './IconButton.svelte';
	import { writable } from 'svelte/store';
	import { manageEventListeners } from '../services/player.service.js';

	// Props
	export let videoContainer;

	// Store
	const tooltipText = writable();
	const icon = writable();
	$: if (fullscreenMode) {
		tooltipText.set('Exit Fullscreen');
		icon.set(ArrowsPointingIn);
	} else {
		tooltipText.set('Fullscreen');
		icon.set(ArrowsPointingOut);
	}

	let fullscreenMode = false;
	function updateFullscreenMode() {
		fullscreenMode = !!document.fullscreenElement;
	}

	// click
	function onClick() {
		if (!document.fullscreenElement) {
			if (videoContainer.requestFullscreen) {
				videoContainer.requestFullscreen();
			} else if (videoContainer.msRequestFullscreen) {
				// IE/Edge
				videoContainer.msRequestFullscreen();
			} else if (videoContainer.mozRequestFullScreen) {
				// Firefox
				videoContainer.mozRequestFullScreen();
			} else if (videoContainer.webkitRequestFullscreen) {
				// Chrome, Safari and Opera
				videoContainer.webkitRequestFullscreen();
			}
		} else {
			document.exitFullscreen();
		}
	}

	// Lifecycle hooks
	onMount(() => {
		const removeListeners = manageEventListeners(
			document,
			['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'],
			updateFullscreenMode
		);
		return () => removeListeners();
	});
</script>

<IconButton on:click={onClick} {icon} {tooltipText} />
