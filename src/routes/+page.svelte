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

		return response;
	};

	let lat: number;
	let lon: number;
	let weatherInfo: TFormattedWeather;

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
		console.log(weatherInfo);
		
		return weatherInfo;
	};
</script>

<main class={`flex flex-col items-center mt-8`}>
	<h1 class="text-4xl mb-4">WeatherMain</h1>
	<div class="flex">
		<input
			class="border-[1px] border-black p-2 rounded-sm focus:bg-green-100 focus-within:outline-stone-500"
			type="text"
			name="city"
			id="city"
			bind:value={city}
			placeholder="Search by city"
		/>
		<button class="border-[1px] border-black p-2 rounded-sm" on:click={() => fetchLocations()}>
			<Search />
		</button>
	</div>
	<div class={`flex flex-col`}>
		{#each locations as { name, state, country, lat, lon }}
			<button on:click={() => fetchWeather(lat, lon)} class="flex gap-2 font-bold">
				<h2>{name},</h2>
				{#if state}
					<h2>{state}</h2>
				{/if}
				<h2>{country}</h2>
			</button>
		{/each}
	</div>

	{#if weatherInfo}
		<div>The Weather in {weatherInfo.locale} is:</div>
		<div class="flex"><Temp />{weatherInfo.currentTemp}</div>
		<div class="flex"><Sun /> {weatherInfo.currentWeather.weather}</div>
		<div>-- {weatherInfo.currentWeather.desc}</div>
		<div>Humidity: {weatherInfo.humidity}%</div>
		<div>Pressure: {weatherInfo.pressure}mbar</div>
		<div>Going down to: {weatherInfo.tempVariance.low}</div>
		<div>And up to: {weatherInfo.tempVariance.high}</div>
		<div>As of {weatherInfo.time}</div>
		<div>With visibility at: {weatherInfo.visibility}</div>
		<div class="flex"><Wind /> {weatherInfo.wind.direction}</div>
		<div>at {weatherInfo.wind.speed}mph</div>
		<div>and gusts up to {weatherInfo.wind.gust}mph</div>
	{/if}
</main>
