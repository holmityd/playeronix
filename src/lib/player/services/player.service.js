import { get } from 'svelte/store';
import { controlsVisibleStore, videoElmStore, videoPausedStore } from '../stores/player.store.js';

/**
 * Toggles play/pause state of the video element.
 * @returns {void}
 */
export function togglePlay() {
	const video = get(videoElmStore);
	if (video.paused) {
		video.play();
	} else {
		video.pause();
	}
}

/**
 * Sets the time of the video element.
 * @param {HTMLVideoElement} video - The HTML video element.
 * @param {number} time - The time to set the video to (in seconds).
 * @returns {void}
 */
export function setVideoTime(video, time) {
	video.currentTime = time;
}

/**
 * Formats time in seconds into HH:MM:SS format.
 * @param {number} timeInSeconds - The time in seconds.
 * @returns {string} The formatted time string.
 */
export function formatTime(timeInSeconds) {
	if (Number.isNaN(timeInSeconds)) return '';
	const hours = Math.floor(timeInSeconds / 3600);
	const minutes = Math.floor((timeInSeconds % 3600) / 60);
	const seconds = Math.floor(timeInSeconds % 60);

	return `${hours > 0 ? hours + ':' : ''}${minutes < 10 ? '0' : ''}${minutes}:${
		seconds < 10 ? '0' : ''
	}${seconds}`;
}

let controlHideTimeout;
/**
 * Hides controls after a delay and manages visibility based on video state.
 * @returns {void}
 */
export function controlDelayedHide() {
	clearTimeout(controlHideTimeout);
	controlsVisibleStore.set(true);
	controlHideTimeout = setTimeout(() => {
		if (!get(videoPausedStore)) controlsVisibleStore.set(false);
	}, 3000);
}

/**
 * Attaches event listeners to the provided element for multiple events and a callback function.
 * @param {HTMLElement | Document} element - The element to attach event listeners to.
 * @param {string[]} events - An array of event names.
 * @param {EventListener} callback - The callback function to be executed when events occur.
 * @returns {Function} A function to remove the added event listeners.
 */
export function manageEventListeners(element, events, callback) {
	events.forEach((event) => element.addEventListener(event, callback));

	// Return a function to remove added event listeners
	return () => events.forEach((event) => element.removeEventListener(event, callback));
}

let previousVolumeLevel = 100;
/**
 * Toggles mute/unmute state of the video element.
 * @returns {void}
 */
export function toggleMute() {
	const video = get(videoElmStore);
	if (!video.volume) {
		video.volume = previousVolumeLevel;
	} else {
		previousVolumeLevel = video.volume;
		video.volume = 0;
	}
}

export function calculateProgress(current, total) {
	try {
		return (current / total) * 100;
	} catch (error) {
		console.error('Failed to calculate progress: ', error);
		return 0;
	}
}

export function createFunctionWithCooldown(callback, delay) {
	let cooldownActive = false;
	return function (...args) {
		if (cooldownActive) return;
		cooldownActive = true;
		setTimeout(() => {
			callback(...args);
			cooldownActive = false;
		}, delay);
	};
}
