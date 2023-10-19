
	export type TLanguageCode = {
		[key: string]: string;
	};

	export type TLocation = {
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

	export type TMain = {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		sea_level: number;
		grnd_level: number;
		humidity: number;
		temp_kf: number;
	}

	export type TWeather = [{
		id: number;
		main: string;
		description: string;
		icon: string
	}]

	export type TClouds = {
		all: number;
	}

	export type TWind = {
		speed: number;
		deg: number;
		gust: number
	}

	export type TSys = {
		pod: string;
	}

	export type TCoord = {
		lat: number;
		lon: number;
	}

	export type TWeatherInfo = {
		base: string; //not used
		clouds: TClouds; //not used
		cod: number; //not used
		coord: TCoord; //not used
		dt: EpochTimeStamp;
		id: number; //not used
		main: TMain;
		name: string;
		sys: TSys; //not used
		timezone: number; //not used
		visibility: number;
		weather: TWeather;
		wind: TWind
	}

	export type TFormattedWeather = {
		time: number;
    locale: string;
    currentTemp: number;
    tempVariance: {
        low: number;
        high: number;
    };
    humidity: number;
    pressure: number;
    visibility: number;
		currentWeather: {
			weather: string;
			desc: string;
		};
		wind: {
			direction: string;
			speed: number;
			gust: number;
		}
	}

function getWindDirection(deg: number) {
  switch (true) {
    case deg >= 0 && deg <= 22.5:
      return 'N';
    case deg > 22.5 && deg <= 45:
      return 'NNE';
    case deg > 45 && deg <= 67.5:
      return 'NE';
    case deg > 67.5 && deg <= 90:
      return 'ENE';
    case deg > 90 && deg <= 112.5:
      return 'E';
    case deg > 112.5 && deg <= 135:
      return 'ESE';
    case deg > 135 && deg <= 157.5:
      return 'SE';
    case deg > 157.5 && deg <= 180:
      return 'SSE';
    case deg > 180 && deg <= 202.5:
      return 'S';
    case deg > 202.5 && deg <= 225:
      return 'SSW';
    case deg > 225 && deg <= 247.5:
      return 'SW';
    case deg > 247.5 && deg <= 270:
      return 'WSW';
    case deg > 270 && deg <= 292.5:
      return 'W';
    case deg > 292.5 && deg <= 315:
      return 'WNW';
    case deg > 315 && deg <= 337.5:
      return 'NW';
    case deg > 337.5 && deg <= 360:
      return 'NNW';
      default: 
				return 'Something went wrong getting the wind direction';
  }
}


export const formatWeatherData = (weatherData: TWeatherInfo) => {
  const formattedWeatherData = {
    time: weatherData.dt,
    locale: weatherData.name,
    currentTemp: weatherData.main.temp,
    tempVariance: { low: weatherData.main.temp_min, high: weatherData.main.temp_max },
    humidity: weatherData.main.humidity,
    pressure: weatherData.main.pressure,
    visibility: weatherData.visibility,
    currentWeather:{ weather: weatherData.weather[0].main, desc: weatherData.weather[0].description },
    wind: { direction: getWindDirection(weatherData.wind.deg), speed: weatherData.wind.speed, gust: weatherData.wind.gust }
  }
  return formattedWeatherData;
}

