import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_KEY } from '$env/static/private';

export const GET: RequestHandler = async ({ url }) => {
	const city = String(url.searchParams.get('city'));

	if (!city || typeof city !== 'string') {
		throw error(400, 'city just needs to be a regular city name, not whatever weirdness you typed in there.');
	}
    
  const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=10&appid=${API_KEY}`);
    
  const data = await response.json();

	return json(data);
};
