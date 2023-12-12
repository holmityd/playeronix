<script>
	import { onMount } from 'svelte';
	import { controlDelayedHide } from './services/player.service.js';
	import {
		canControlStore,
		videoElmStore,
		videoPausedStore,
		styleStore
	} from './stores/player.store.js';
	import VideoControls from './components/VideoControls.svelte';

	// Props
	export let src = '';
	export let subtitles = '';
	export let canControl = true;
	/**
	 * @type {'default' | 'youtube'}
	 */
	export let style = 'default';

	// Elements
	let videoContainer;
	let video;

	onMount(() => {
		videoElmStore.set(video);
		canControlStore.set(canControl);
		styleStore.set(style);
		const videoPauseUnsubscribe = videoPausedStore.subscribe(() => controlDelayedHide());
		return () => {
			videoPauseUnsubscribe();
		};
	});
</script>

<div
	bind:this={videoContainer}
	on:mousemove={controlDelayedHide}
	class="relative flex h-full items-center box-border rounded-sm shadow-lg overflow-hidden select-none bg-black"
	role="application"
>
	<video
		bind:this={video}
		on:play={() => videoPausedStore.set(false)}
		on:pause={() => videoPausedStore.set(true)}
		{src}
		class="w-full max-w-full h-full max-h-full"
	>
		<track kind="captions" srclang="en" src={subtitles} label="English" default />
	</video>

	{#if video}
		<VideoControls {videoContainer} />
	{/if}
</div>
