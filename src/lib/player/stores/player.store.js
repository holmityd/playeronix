import { writable } from 'svelte/store';

export const videoPausedStore = writable(true);
export const controlsVisibleStore = writable(true);
/**
 * @type {import('svelte/store').Writable<HTMLVideoElement | undefined>}
 */
export const videoElmStore = writable();
export const videoSourceStore = writable(
	'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
);
export const canControlStore = writable(true);
export const styleStore = writable('default');
