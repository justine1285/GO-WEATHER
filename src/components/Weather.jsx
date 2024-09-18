import React, { useEffect, useRef, useState, } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/clouds.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import location_icon from '../assets/location.png'
import mist_icon from '../assets/mist.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'

const Weather = () => {
  
  const inputRef = useRef()
  const [weatherData, getWeather] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState('C');

  const weatherIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": mist_icon,
    "10n": mist_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  }

  const getCity = async (city)=>{
    if(city === ""){
      alert("Enter city name");
      return;
    }
    try {
      const base = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

      const response = await fetch(base);
      const data = await response.json();

      if(!response.ok){
        alert(data.message);
        return;
      }

      console.log(data);
      const icons = weatherIcons[data.weather[0].icon] || clear_icon;

      getWeather({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icons: icons,
      });
    } catch (error) {
        getWeather(false);
        console.error("Error fetching data");
    }
  }
  useEffect(()=>{
    getCity("Abuja");
  },[])

  const fetchCity = (e) => {
    e.preventDefault();
    getCity(inputRef.current.value);
    inputRef.current.value = "";
  };

  const convertToFahrenheit = () => {
    if (weatherData && temperatureUnit === 'C') {
      const tempF = Math.floor(weatherData.temperature * 9/5 + 32);
      getWeather({ ...weatherData, temperature: tempF });
      setTemperatureUnit('F');
    }
  };

  // Convert temperature to Celsius
  const convertToCelsius = () => {
    if (weatherData && temperatureUnit === 'F') {
      const tempC = Math.floor((weatherData.temperature - 32) * 5/9);
      getWeather({ ...weatherData, temperature: tempC });
      setTemperatureUnit('C');
    }
  };

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const base = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
          const response = await fetch(base);
          const data = await response.json();

          if (!response.ok) {
            alert(data.message);
            return;
          }

          const icons = weatherIcons[data.weather[0].icon] || clear_icon;

          getWeather({
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            temperature: Math.floor(data.main.temp),
            location: data.name,
            icons: icons,
            latitude: data.coord.lat, // Store latitude
            longitude: data.coord.lon, // Store longitude
          });
          
        } catch (error) {
          console.error("Error fetching data", error);
        }
      }, (error) => {
        alert('Error fetching your location. Make sure location services are enabled.');
        console.error(error);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className='weather'>
      <div className="search-bar">
        <form className='search' onSubmit={fetchCity}>
        <input ref={inputRef} type="text" placeholder='Enter city'/>
        </form>
        <img src={search_icon} alt="" onClick={()=>getCity(inputRef.current.value)}/>
      </div>
      <div className='temp-buttons'>
        <button onClick={convertToCelsius} className={`temp-btn ${temperatureUnit === 'C' ? 'active' : ''}`}>
          &deg;C
        </button>
        <button onClick={convertToFahrenheit} className={`temp-btn ${temperatureUnit === 'F' ? 'active' : ''}`}>
          &deg;F
        </button>
        <img src={location_icon} alt="location" className='location-icon' onClick={getCurrentLocationWeather} />
      </div>
      {weatherData?<>
      <img src={weatherData.icons} alt="" className='weather-icon'/>
        <p className='location'>{weatherData.location.toUpperCase()}</p>
        <div className='temperature'>
          <span>{weatherData.temperature}</span>
          <span>&deg;{temperatureUnit}</span>
        </div>
        <div className='weather-data'>
          <div className='col'>
          <img src={humidity_icon} alt="" />
            <div>
            <p>{weatherData.humidity} %</p>
            <span>Humidity</span>
            </div>
          </div>
          <div className='col'>
          <img src={wind_icon} alt="" />
            <div>
            <p>{weatherData.windSpeed} km/h</p>
            <span>Wind speed</span>
            </div>
          </div>
        </div>
      </>:<></>}
      
    </div>
  )
}

export default Weather;
