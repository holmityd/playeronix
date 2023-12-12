<script>
	import { onMount } from 'svelte';
	import {
		calculateProgress,
		createFunctionWithCooldown,
		formatTime,
		manageEventListeners,
		setVideoTime
	} from '../services/player.service.js';
	import { writable } from 'svelte/store';
	import { canControlStore, styleStore, videoElmStore } from '../stores/player.store.js';
	import { twMerge } from 'tailwind-merge';

	$: video = $videoElmStore;
	$: canControl = $canControlStore;

	// Stores
	const progress = writable(0);
	const bufferProgress = writable(0);
	const hoverProgress = writable(0);

	let progressBarElement;

	// Util
	const saveTimeEveryFiveSeconds = createFunctionWithCooldown(() => {
		// console.log(time);
		// localStorage.setItem(VIDEO_TIME, String(video.currentTime));
	}, 5000);
	function updateProgress() {
		if (!video.paused) saveTimeEveryFiveSeconds(video.currentTime);
		progress.set(calculateProgress(video.currentTime, video.duration));
	}

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

	// Lifecycle hooks
	onMount(() => {
		const listeners = [
			{
				elm: video,
				events: {
					timeupdate: () => updateProgress(),
					progress: () => updateBufferProgress()
				}
			},
			{
				elm: progressBarElement,
				events: {
					mousedown: (e) => mouseDown(e),
					mousemove: (e) => mouseHover(e),
					mouseout: () => mouseOut()
				}
			},
			{
				elm: document,
				events: {
					mousemove: (e) => mouseMove(e),
					mouseup: () => mouseUp()
				}
			}
		];
		const removeListeners = listeners.map((listener) =>
			manageEventListeners(listener.elm, Object.keys(listener.events), (e) =>
				listener.events[e.type](e)
			)
		);
		return () => removeListeners.forEach((item) => item());
	});

	$: style = $styleStore;

	const progressBarStyles = {
		default: 'bg-gray-700',
		youtube: 'bg-white/40 -translate-y-1/2'
	};
	$: progressBarClasses = twMerge(
		'h-full relative group outline-none',
		progressBarStyles[style],
		canControl ? 'cursor-pointer' : 'cursor-default'
	);

	const lineStyles = {
		buffer: {
			default: 'bg-gray-500/50',
			youtube: 'bg-white/25'
		},
		hover: {
			default: 'bg-slate-100/25',
			youtube: 'bg-white/50'
		},
		progress: {
			default: 'bg-green-500',
			youtube: 'bg-red-600'
		}
	};
	$: lineClass = (line) => twMerge('absolute h-full', lineStyles[line][style]);
</script>

<div
	class={progressBarClasses}
	bind:this={progressBarElement}
	aria-label="Video progress"
	role="progressbar"
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={$progress | 0}
>
	<span class="absolute bottom-0 left-0 w-full h-2.5" />
	<div class="pointer-events-none">
		<div class={lineClass('buffer')} style="width: {$bufferProgress}%;" />
		<div class={lineClass('hover')} style="width: {$hoverProgress}%;" />
		<div class={lineClass('progress')} style="width: {$progress}%;" />
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
