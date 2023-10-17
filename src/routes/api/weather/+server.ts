
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_KEY } from '$env/static/private';

export const GET: RequestHandler = async ({ url }) => {

  const lat = url.searchParams.get('lat');
  const lon = url.searchParams.get('lon');

  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`);
    
  const data = await response.json();

	return json(data);
};
