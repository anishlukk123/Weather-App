import React, { useState } from 'react';
import rain from './assets/rain_bg.png';
import snow from './assets/cold_snow_bg.png';
import warm from './assets/hot_bg.png';
import cold from './assets/cold_bg.png';
import defa from './assets/default_bg.png';


const api ={
  key: "b558516afabd80aaedfa4b01d93278d6",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {

  const [query, setQuery] = useState('');
  var [activeQuery, setActiveQuery] = useState('');
  const [weather, setWeather] = useState({});
  //const [weatherForecast, setWeatherForecast] = useState('');

  const background = [defa, warm, cold, rain, snow]
  const [backgroundNumber, setBackgroundNumber] = useState(0);

  const [errorMessage, setErrorMessage] = useState(false);

  const search = evt =>{
    if(evt.key === "Enter") {
      setActiveQuery(query)
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
      .then(res => {
        if (res.ok) {
          setErrorMessage(false)
          return res.json();
        } else {
          throw new Error('invalid input');
        }
      })
      .then(result => {
        setActiveQuery(query)
        setWeather(result);
        console.log(result.weather[0].main); 
        if(result.weather[0].main.temp > 16){
          setBackgroundNumber(1)
        }
        else if(result.weather[0].main.temp < 16){
          setBackgroundNumber(2)
        }
        else if(result.weather[0].main === "Thunderstorm" || result.weather[0].main === "Rain"){
          setBackgroundNumber(3)
          console.log("thisalsoran")
        }
        else if(result.weather[0].main === "Snow"){
          setBackgroundNumber(4)
        }
       
        else{
          setBackgroundNumber(0)
          console.log("thisran")
        }
        setQuery('');
      })
      .catch((error) => {
        console.log(error)
        setErrorMessage(true)
      });
    }
}

function clear() {
  fetch(`${api.base}weather?q=${query}&units=$metric&APPID=${api.key}`)
  .then(res => res.json())
  .then(result => {
    setWeather(result);
    setQuery('');
  });
}

  const dateBuilder = (d) =>{
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  return (
    <div className='app' style={{backgroundImage: `url(${background[backgroundNumber]})`, backgroundSize: 'cover'}}>
      <main>
        <div className="search-box">
          <input 
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {(typeof weather.main != "undefined") ? (
        <div>
          <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          <div className="weather-box">
            <div className="temp">
              {Math.round(weather.main.temp)}°c
            </div>
            <div className="weather">
              {weather.weather[0].main}</div>
          </div>
        </div>
        ) : ('')}
        <div className="clear-box">
            <input 
              className="clear-button"
              type="button"
              value="Clear"
              onClick={clear}
            /> 
          </div>
      </main>
    </div>
  );
}

export default App;
