<script lang="ts">
	import '../app.postcss';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export const lat = writable(0);
	export const lon = writable(0);

	
</script>

<slot />
