<script>
  import Dark from '../icons/dark.svg';
  import Light from '../icons/light.svg';
  export let themeName = 'light';
</script>
  
  <button class="absolute top-1 left-4 flex text-sm items-center gap-2" on:click={() => themeName === 'light' ? themeName = 'dark' : themeName = 'light'}>
    {#if themeName === 'light'} 
      <img src={Dark} alt='theme switch' width={30}/> dark 
    {:else if themeName === 'dark'} 
      <img src={Light} alt='theme switch'  width={30}/> light
    {/if}
    
  </button>