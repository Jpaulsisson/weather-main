<script lang="ts">
	import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  type TLanguageCode = {
    [key: string]: string
  }

  type TLocation = {
    name: string,
    local_names: {
      language_code: TLanguageCode[],
      ascii: string,
      feature_name: string,
    },
    lat: number,
    lon: number,
    country: string,
    state?: string
  }

  export let city: string = $page.url.searchParams.get('city') || '';
  export let locations: TLocation[] = [];

  export const fetchLocations = async () => {
    const response = await fetch(`/api/location?city=${city}`);
    locations = await response.json()
    return response;
  }

</script>


<h1>WeatherMain</h1>
<input class="border-[1px] border-black p-2 rounded-sm" type="text" name='city' id="city" bind:value={city} placeholder="Search by city name">
<button class="border-[1px] border-black p-2 rounded-sm" on:click={() => fetchLocations()}>Find my city</button>
<div class="flex flex-col">
  {#each locations as location}
  <div class="flex gap-2 font-bold">
    <h2>{location.name},</h2>
    {#if location.state} 
    <h2>{location.state}</h2>
    {/if}
    <h2>{location.country}</h2>
    
  </div>
{/each}
</div>
