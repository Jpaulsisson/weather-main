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
	import Storm from '../components/storm.svelte';
	import Haze from '../components/haze.svelte';
	import Sand from '../components/sand.svelte';
	import Tornado from '../components/tornado.svelte';
	import Pressure from '../components/pressure.svelte';
	import type { TLocation, TFormattedWeather } from './helpers';

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
	let weatherInfo: TFormattedWeather | null;

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
		<div class="w-full px-6 md:px-20 flex flex-col gap-10">
			<!-- main temperature -->
			<div class='flex items-baseline'>
				<Temp />
				<h2 class="text-8xl text-end">
					{Math.round(weatherInfo.currentTemp)}˚
				</h2>
				<span class="text-xs uppercase tracking-widest">{weatherInfo.locale}</span>
			</div>
			<!-- current weather conditions -->
			<div class="flex gap-3 text-2xl md:text-3xl items-center">
				{#if weatherInfo.currentWeather.weather === 'Thunderstorm'}
				<Storm />
				<p>Thunderstorms</p>
				{:else if weatherInfo.currentWeather.weather === 'Drizzle'}
				<Rain />
				<p>Drizzly</p>
				{:else if weatherInfo.currentWeather.weather === 'Rain'}
				<Rain />
				<p>Raining</p>
				{:else if weatherInfo.currentWeather.weather === 'Snow'}
				<Snow />
				<p>Snowing</p>
				{:else if weatherInfo.currentWeather.weather === 'Mist'}
				<Haze />
				<p>Misty</p>
				{:else if weatherInfo.currentWeather.weather === 'Smoke'}
				<Haze />
				<p>Smoky</p>
				{:else if weatherInfo.currentWeather.weather === 'Haze'}
				<Haze />
				<p>Hazy</p>
				{:else if weatherInfo.currentWeather.weather === 'Dust'}
				<Sand />
				<p>Dusty</p>
				{:else if weatherInfo.currentWeather.weather === 'Fog'}
				<Haze />
				<p>Foggy</p>
				{:else if weatherInfo.currentWeather.weather === 'Sand'}
				<Sand />
				<p>Sandy</p>
				{:else if weatherInfo.currentWeather.weather === 'Ash'}
				<Haze />
				<p>Ashey</p>
				{:else if weatherInfo.currentWeather.weather === 'Squall'}
				<Wind />
				<p>Squalls</p>
				{:else if weatherInfo.currentWeather.weather === 'Tornado'}
				<Tornado />
				<p>Tornado</p>
				{:else if weatherInfo.currentWeather.weather === 'Clear'}
				<Sun />
				<p>Clear</p>
				{:else if weatherInfo.currentWeather.weather === 'Clouds'}
				<Clouds />
				<p>Cloudy</p>
				{/if}
			</div>
			<!-- humidity percentage -->
			<div class="flex gap-3 text-xl md:text-2xl items-center">
				<Humid />
				<p>{weatherInfo.humidity}%</p>
			</div>
			<!-- pressure -->
			<div class="flex gap-3 text-xl md:text-2xl items-center">
				<Pressure />
				<p>{weatherInfo.pressure}<span class="text-xs">mbar</span></p>
			</div>
			<!-- wind -->
			<div class="flex gap-3 text-xl md:text-2xl items-center">
				<Wind />
				<p>{weatherInfo.wind.direction} {weatherInfo.wind.speed}<span class="text-xs">/mph</span></p>
			</div>
		</div>
	{/if}
</main>
