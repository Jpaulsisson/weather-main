<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { list } from 'postcss';

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
		temp: number,
		feels_like: number,
		temp_min: number,
		temp_max: number,
		pressure: number,
		sea_level: number,
		grnd_level: number,
		humidity: number,
		temp_kf: number,
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

	type TList = {
		dt: number,
		main: TMain,
		weather: TWeather[],
		clouds: TClouds,
		wind: TWind,
		visibility: number,
		pop: number,
		rain: TRain,
		sys: TSys,
		dt_txt: string
	}

	type TCoord = {
		lat: number,
		lon: number,
	}

	type TCity = {
		id: number,
		name: string,
		coord: TCoord,
	}

	type TWeatherInfo = {
		cod: string,
		message: number,
		cnt: number,
		list: TList[],
		city: TCity,
		country: string,
		population: number,
		timezone: number,
		sunrise: number,
		sunset: number,
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
let weatherInfo: TWeatherInfo;

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

	{#if weatherInfo}
	<h2>Here's your weather info for {weatherInfo.city.name} for the next five days</h2>
	{#each weatherInfo.list as list}
	<div>
		<p>{list.dt_txt}</p>
		{#if list.weather[0].main === 'Clouds'}
		<p>☁️</p>
		{:else if list.weather[0].main === 'Sunny'}
		<p>☀️</p>
		{/if}
	</div>
	{/each}
	{/if}

	</main>
