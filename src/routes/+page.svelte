<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { formatWeatherData } from './helpers';
	import Temp from '../components/temp.svelte';
	import Sun from '../components/sun.svelte';
	import Wind from '../components/wind.svelte';
	import Rain from '../components/rain.svelte';
	import Snow from '../components/snow.svelte';
	import Clouds from '../components/clouds.svelte';
	import Search from '../components/search.svelte';
	import Humid from '../components/humid.svelte';
	import type { 
		TClouds, 
		TCoord, 
		TLanguageCode, 
		TLocation,
		TMain,
		TWeather,
		TWind,
		TSys,
		TWeatherInfo,
		TFormattedWeather
		} from './helpers';

	let city: string = '';
	let locations: TLocation[] = [];

	export const fetchLocations = async () => {
		const response = await fetch(`/api/location?city=${city}`);
		locations = await response.json();

		if (locations.length < 1) return alert('no such city')
		return response;
	};

	let lat: number;
	let lon: number;
	// let weatherInfo: TFormattedWeather | null;

	let weatherInfo = {
		time: 0,
    locale: 'string',
    currentTemp: 75,
    tempVariance: {
        low: 72,
        high: 78,
    },
    humidity: 80,
    pressure: 1000,
    visibility: 1000,
    currentWeather: {
        weather: 'Clouds',
        desc: 'moderate clouds',
    },
    wind: {
        direction: 135,
        speed: 20,
        gust: 25,
    },
}

	const fetchWeather = async (newLat: number, newLon: number) => {
		if (typeof newLat !== 'number' && typeof newLon !== 'number') {
			return error;
		}

		lat = newLat;
		lon = newLon;

		const response = await fetch(`api/weather?lat=${lat}&lon=${lon}`);

		const initialWeatherInfo = await response.json();
		locations = [];
		const formatted = formatWeatherData(initialWeatherInfo);
		weatherInfo = formatted;
		console.log(weatherInfo)
		return weatherInfo;
	};
</script>

<main class={`flex flex-col items-center mt-8`}>
	<h1 class="text-4xl md:text-5xl mb-6">WeatherMain</h1>

	<!-- location search bar -->
	{#if !weatherInfo}
	<div class="flex mb-6">
		<input
			class="border-[1px] border-[var(--fontColor)] p-2 rounded-sm text-[var(--fontColor)] bg-[var(--bgColor)] focus-within:outline-stone-500"
			type="text"
			name="city"
			id="city"
			bind:value={city}
			placeholder="Search by city"
		/>
		<button class="border-[1px] border-[var(--fontColor)] p-2 rounded-sm bg-emerald-400" on:click={() => fetchLocations()}>
			<Search />
		</button>
	</div>
	{:else}
	<div class="mb-6">
		<button class="border-[1px] border-[var(--fontColor)] p-1 rounded-sm text-sm text-[var(--bgColor)] bg-[var(--fontColor)]" on:click={() => weatherInfo = null}>
			New search
		</button>
	</div>
	{/if}

	<!-- locations -->
	{#if locations.length > 0}
		<div class={`flex flex-col gap-3 p-2`}>
			<p>Choose a location:</p>
			{#each locations as { name, state, country, lat, lon }}
				<button on:click={() => fetchWeather(lat, lon)} class="flex gap-2 border-[1px] border-emerald-400 p-2 rounded-md">
					<h2>{name},</h2>
					{#if state}
						<h2>{state}</h2>
					{/if}
					<h2>{country}</h2>
				</button>
			{/each}
		</div>
	{/if}

	<!-- weather info -->
	{#if weatherInfo}
		<div class="w-full px-6 md:px-20">
			<!-- main temperature -->
			<div class='flex items-baseline'>
				<Temp />
				<h2 class="text-8xl text-end">
					{Math.round(weatherInfo.currentTemp)}˚
				</h2>
			</div>
			<!-- current weather conditions -->
			<div class="flex gap-3 text-lg md:text-2xl items-center">
				{#if weatherInfo.currentWeather.weather === 'Clouds'}
				<Clouds/>
				<p>Cloudy</p>
				{/if}
			</div>
		</div>
	{/if}
</main>
