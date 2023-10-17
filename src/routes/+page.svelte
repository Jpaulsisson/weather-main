<script lang="ts">
	import { page } from '$app/stores';	
	import { error } from '@sveltejs/kit';
	import { stringify } from 'postcss';
	import { circIn } from 'svelte/easing';

	type TLanguageCode = {
		[key: string]: string;
	};

	type TLocation = {
		name: string;
		local_names: {
			language_code: TLanguageCode[];
			ascii: string;
			feature_name: string;
		};
		lat: number;
		lon: number;
		country: string;
		state?: string;
	};

	type TMain = {
		[key: string]: number,
	}

	type TList = {
		dt: number,
		main: TMain,
	}

	type TWeather = {
		id: number,
		main: string,
		description: string,
		icon: string
	}

	type TClouds = {
		all: number
	}

	type TWind = {
		speed: number,
		deg: number,
		gust: number
	}

	type TRain = {
		'3h': number
	}

	type TSys = {
		pod: string,
	}

	type TWeatherInfo = {
		cod: string,
		message: number,
		cnt: number,
		list: TList[],
		weather: TWeather[],
		clouds: TClouds,
		wind: TWind,
		visibility: number,
		pop: number,
		rain: TRain,
		sys: TSys,
		dt_txt: string
	}


let city: string = '';
let locations: TLocation[] = [];

	export const fetchLocations = async () => {
		const response = await fetch(`/api/location?city=${city}`);
		locations = await response.json();

		return response;
	};

let lat: number;
let lon: number;
let weatherInfo;

const fetchWeather = async (newLat: number, newLon: number) => {
	if (typeof newLat !== 'number' && typeof newLon !== 'number') {
		return error;
	}

	lat = newLat;
	lon = newLon;

	const response = await fetch(`api/weather?lat=${lat}&lon=${lon}`)

	weatherInfo = await response.json();
	locations = [];

	console.log(weatherInfo);
	return weatherInfo;
}

function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const time = new Date(timestamp);
    const formattedDate =  date.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: '2-digit'});
    const formattedTime = time.toLocaleTimeString('en-US')
    return {
      formattedDate: formattedDate,
      formattedTime: formattedTime
    };
  }
</script>

<main class="flex flex-col items-center mt-8">
	<h1 class="text-4xl mb-4">WeatherMain</h1>
	<div class="flex">
		<input
			class="border-[1px] border-black p-2 rounded-sm focus:bg-green-100 focus-within:outline-stone-500"
			type="text"
			name="city"
			id="city"
			bind:value={city}
			placeholder="Search by city name"
		/>
		<button class="border-[1px] border-black p-2 rounded-sm" on:click={() => fetchLocations()}
			>Find my city</button
		>
	</div>
	<div class="flex flex-col">
		{#each locations as {name, state, country, lat, lon}}
			<button on:click={() => fetchWeather(lat, lon)} class="flex gap-2 font-bold">
				<h2>{name},</h2>
				{#if state}
					<h2>{state}</h2>
				{/if}
				<h2>{country}</h2>
			</button>
		{/each}
	</div>
	<button on:click={() => console.log(lat, lon)}>log coords</button>

	<div>
		<p></p>	
	</div>

</main>
