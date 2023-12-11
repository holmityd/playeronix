<script>
	import { onMount } from 'svelte';
	import { formatTime, manageEventListeners, setVideoTime } from '../services/player.service.js';
	import { writable } from 'svelte/store';
	import { canControlStore, videoElmStore } from '../stores/player.store.js';

	$: video = $videoElmStore;
	$: canControl = $canControlStore;

	// Stores
	const progress = writable(0);
	const bufferProgress = writable(0);
	const hoverProgress = writable(0);

	let progressBarElement;

	// Util
	function calculateProgress(current, total) {
		try {
			return (current / total) * 100;
		} catch (error) {
			console.error('Failed to calculate progress: ', error);
			return 0;
		}
	}

	// Progress
	function updateProgress() {
		try {
			if (!video.paused) saveTimeEveryFiveSeconds();
			progress.set(calculateProgress(video.currentTime, video.duration));
		} catch (error) {
			console.error(
				'An error occurred while updating video progress. Video playback has been stopped.'
			);
		}
	}
	function createFunctionWithCooldown(callback, delay) {
		let cooldownActive = false;
		return function () {
			if (cooldownActive) return;
			cooldownActive = true;
			setTimeout(() => {
				callback();
				cooldownActive = false;
			}, delay);
		};
	}
	const saveTimeEveryFiveSeconds = createFunctionWithCooldown(() => {
		// localStorage.setItem(VIDEO_TIME, String(video.currentTime));
	}, 5000);

	// Buffer progress
	function updateBufferProgress() {
		try {
			const { length } = video.buffered;
			const { currentTime } = video;
			for (let i = 0; i < length; i++) {
				if (video.buffered.start(i) <= currentTime && currentTime <= video.buffered.end(i)) {
					bufferProgress.set(calculateProgress(video.buffered.end(i), video.duration));
					break;
				}
			}
		} catch (error) {
			console.error(
				'An error occurred while trying to update video buffering. Please try again or contact support.'
			);
		}
	}

	// Changing progress
	let isDragging = false;
	function setProgress(event) {
		if (!canControl) return;
		try {
			const rect = progressBarElement.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const clickedValue = (x * video.duration) / rect.width;
			setVideoTime(video, clickedValue);
		} catch (error) {
			console.error('An error occurred while setting video progress.');
		}
	}
	function mouseDown(event) {
		isDragging = true;
		setProgress(event);
	}
	function mouseUp() {
		isDragging = false;
	}
	function mouseMove(event) {
		if (isDragging) {
			setProgress(event);
		}
	}

	// Timeline tooltip
	let hoverDuration;
	function mouseHover(event) {
		try {
			const { left, width } = progressBarElement.getBoundingClientRect();
			const x = event.clientX - left;
			hoverDuration = formatTime((x / width) * video.duration);
			hoverProgress.set(calculateProgress(x, width));
		} catch (error) {
			console.error('An error occurred while hovering over the progress bar.');
		}
	}
	function mouseOut() {
		hoverDuration = undefined;
		hoverProgress.set(0);
	}

	// Event listeners
	function videoEvents(event) {
		switch (event.type) {
			case 'timeupdate':
				updateProgress();
				break;
			case 'progress':
				updateBufferProgress();
				break;
		}
	}
	function progressMouseEvents(event) {
		switch (event.type) {
			case 'mousedown':
				mouseDown(event);
				break;
			case 'mousemove':
				mouseHover(event);
				break;
			case 'mouseout':
				mouseOut();
				break;
		}
	}
	function documentMouseEvents(event) {
		switch (event.type) {
			case 'mousemove':
				mouseMove(event);
				break;
			case 'mouseup':
				mouseUp();
				break;
		}
	}

	// Lifecycle hooks
	onMount(() => {
		const removeListeners = [
			manageEventListeners(video, ['timeupdate', 'progress'], videoEvents),
			manageEventListeners(
				progressBarElement,
				['mousedown', 'mousemove', 'mouseout'],
				progressMouseEvents
			),
			manageEventListeners(document, ['mousemove', 'mouseup'], documentMouseEvents)
		];
		return () => removeListeners.forEach((item) => item());
	});
</script>

<div
	class="h-full relative group bg-gray-700 outline-none {canControl
		? 'cursor-pointer'
		: 'cursor-default'}"
	bind:this={progressBarElement}
	aria-label="Video progress"
	role="progressbar"
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={$progress | 0}
>
	<span class="absolute bottom-0 left-0 w-full h-2.5" />
	<div class="pointer-events-none">
		<div class="absolute h-full bg-gray-500/50" style="width: {$bufferProgress}%;" />
		<div class="absolute h-full bg-slate-100/25" style="width: {$hoverProgress}%;" />
		<div class="absolute h-full bg-green-500" style="width: {$progress}%;" />
	</div>
	{#if hoverDuration}
		<div
			class="absolute mb-2 bottom-full -translate-x-1/2
			bg-gray-800 shadow text-xs text-white px-2 py-1 rounded"
			style="left: {$hoverProgress}%;"
			aria-live="polite"
			aria-atomic="true"
			aria-label="Hover duration: {hoverDuration}"
		>
			{hoverDuration}
		</div>
	{/if}
</div>
