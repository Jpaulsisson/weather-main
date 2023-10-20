<script lang="ts">
	import '../app.postcss';
	import Binder from './Binder.svelte';

	let theme: string = 'dark';

</script>

<svelte:head>
	{#if theme === 'light'}
	<link rel="stylesheet" href="/styles/themes/light-theme.css">
	{:else}
	<link rel="stylesheet" href="/styles/themes/dark-theme.css">
	{/if}
</svelte:head>

<Binder bind:themeName={theme}/>
<slot />
