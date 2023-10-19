<script lang="ts">
	import '../app.postcss';
	import Binder from './Binder.svelte';

	let theme: string;

</script>

<svelte:head>
	<link rel="stylesheet" href="src/styles/themes/{theme}-theme.css">
</svelte:head>

<Binder bind:themeName={theme}/>
<slot />
