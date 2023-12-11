<script>
	import { onMount } from 'svelte';
	import { controlDelayedHide } from './services/player.service.js';
	import { canControlStore, videoElmStore, videoPausedStore } from './stores/player.store.js';
	import PlayerSkeleton from './components/PlayerSkeleton.svelte';
	import VideoControls from './components/VideoControls.svelte';

	// Props
	export let src = '';
	export let subtitles = '';
	export let canControl = true;

	// Elements
	let videoContainer;
	let video;

	// PlayerSkeleton
	let showSkeleton = false;
	$: if (src) {
		showSkeleton = true;
	}

	onMount(() => {
		videoElmStore.set(video);
		canControlStore.set(canControl);
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
		on:canplay={() => {
			showSkeleton = false;
		}}
		on:play={() => videoPausedStore.set(false)}
		on:pause={() => videoPausedStore.set(true)}
		{src}
		class="w-full max-w-full h-full max-h-full"
	>
		<track kind="captions" srclang="en" src={subtitles} label="English" default />
	</video>

	{#if showSkeleton}
		<PlayerSkeleton />
	{/if}

	{#if video}
		<VideoControls {videoContainer} />
	{/if}
</div>
