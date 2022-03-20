import React, {useState} from 'react';
import rain from './images/rain.png';
import snow from './images/snow.png';
import cold from './images/cold.png';
import defaultImg from './images/default.png';
import hot from './images/hot.png';

const api = {
  key: "0a2df7d88ca8849ed565d07e8a72fb7c",
  base: "https://api.openweathermap.org/data/2.5/"
}


function App() {

  var [query, setQuery] = useState('');
  var [activeQuery, setActiveQuery] = useState('');
  const [weather, setWeather] = useState('');
  const [weatherForecast, setWeatherForecast] = useState('');

  var [unit, setUnit] = useState('imperial');
  var [unitAbrev, setUnitAbrev] = useState('F');
  const unitImperial = 'imperial';
  const unitMetric = 'metric';

  const maxTempF = 93;
  const minTempF = 35;

  const maxTempC = 34;
  const minTempC = 1;

  const [temperature, setTemperature] = useState(0);

  const [redVal, setRedVal] = useState(255 / (maxTempF - minTempF) * (temperature - minTempF));
  const [blueVal, setBlueVal] = useState(255 / (maxTempF - minTempF) * (maxTempF - temperature));

  const background = [null, defaultImg, rain, snow, cold, hot]
  const [backgroundNumber, setBackgroundNumber] = useState(0);

  const [errorMessage, setErrorMessage] = useState(false);

  const search = evt => {
    if(evt.key === "Enter" && unitAbrev === 'F') {
      setActiveQuery(query)
      fetch(`${api.base}weather?q=${query}&units=${unit}&APPID=${api.key}`)
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
        setWeatherForecast(result.weather[0].main);
        setTemperature(result.weather.temp)
        console.log(result.weather[0].main);
        setRedVal(255 / (maxTempF - minTempF) * (result.main.temp - minTempF));
        setBlueVal(255 / (maxTempF - minTempF) * (maxTempF - result.main.temp));
        if(result.weather[0].main === "Thunderstorm" || result.weather[0].main === "Rain"){
          setBackgroundNumber(2)
          console.log("thisalsoran")
        }
        else if(result.weather[0].main === "Snow"){
          setBackgroundNumber(3)
        }
        else{
          setBackgroundNumber(1)
          console.log("thisran")
        }
        setQuery('');
      })
      .catch((error) => {
        console.log(error)
        setErrorMessage(true)
      });
    }
    if(evt.key === "Enter" && unitAbrev === 'C') {
      fetch(`${api.base}weather?q=${query}&units=${unit}&APPID=${api.key}`)
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
        setWeatherForecast(result.weather[0].main);
        console.log(result.main.temp)
        setTemperature(result.main.temp)
        setRedVal(255 / (maxTempC - minTempC) * (result.main.temp - minTempC));
        setBlueVal(255 / (maxTempC - minTempC) * (maxTempC - result.main.temp));
        if(result.weather[0].main === "Thunderstorm" || result.weather[0].main === "Rain"){
          setBackgroundNumber(2)
        }
        else if(result.weather[0].main === "Snow"){
          setBackgroundNumber(3)
        }
        else if(result.main.temp >= 34){
          setBackgroundNumber(5)
        }
        else if(result.weather[0].main <= 1){
          setBackgroundNumber(4)
        }
        else{
          setBackgroundNumber(1)
        }
        setQuery('');
      })
      .catch((error) => {
        console.log(error)
        setErrorMessage(true)
      });
    }
  }

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }

  function tempColor(){
    if(unit === unitImperial){
      setRedVal(255 / (maxTempF - minTempF) * (temperature - minTempF));
      setBlueVal(255 / (maxTempF - minTempF) * (maxTempF - temperature));
    }
    if(unit === unitMetric){
      setRedVal(255 / (maxTempC - minTempC) * (temperature - minTempC));
      setBlueVal(255 / (maxTempC - minTempC) * (maxTempC - temperature));
    }
  }

  function changeUnit() {
    console.log(activeQuery)
    if(unit === unitMetric){
      setUnit('imperial');
      setUnitAbrev('F');

      if(activeQuery !== ''){
        fetch(`${api.base}weather?q=${activeQuery}&units=imperial&APPID=${api.key}`)
        .then(res => {
          if (res.ok) {
            setErrorMessage(false)
            return res.json();
          } else {
            throw new Error('invalid input');
          }
        })
        .then(result => {
          setWeather(result);
          setTemperature(result.main.temp)
        })
        .catch((error) => {
          console.log(error)
          setErrorMessage(true)
        });
        tempColor();
      }
    }
    if(unit === unitImperial){
      setUnit('metric');
      setUnitAbrev('C');

      if(activeQuery !== ''){
        fetch(`${api.base}weather?q=${activeQuery}&units=metric&APPID=${api.key}`)
        .then(res => {
          if (res.ok) {
            setErrorMessage(false)
            return res.json();
          } else {
            throw new Error('invalid input');
          }
        })
        .then(result => {
          console.log(result)
          setWeather(result);
          setTemperature(result.main.temp)
          console.log(result.main.temp)
        })
        .catch((error) => {
          console.log(error)
          setErrorMessage(true)
        });
        tempColor();
      }
    }
  }

  function clear() {
    fetch(`${api.base}weather?q=${query}&units=${unit}&APPID=${api.key}`)
    .then(res => res.json())
    .then(result => {
      setWeather(result);
      setQuery('');
    });
  }

  return (
    <div className='app' style={{backgroundImage: `url(${background[backgroundNumber]})`}}> 
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

        <div className="switch-unit">
            <input 
              type="checkbox"
              id="toggle"
              className="checkbox"
              onChange={e => setQuery(e.target.value)}
              value={query}
              onClick= {changeUnit}
            />
          <label htmlFor="toggle" className="switch" />
        </div>
        {(errorMessage) ? (
        <div className="error">
          <p className="error-message">please enter a valid city or country</p>
        </div>
        ) : ('')}
        {(typeof weather.main != "undefined") ? (
        <div className="wrapper">
          <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          <div className="weather-box">
            <div className="temp" style={{ color : `rgb(${redVal}, 0, ${blueVal})` }}>
              {Math.round(weather.main.temp)}°{unitAbrev}
            </div>
            <div className="weather">{weatherForecast}</div>
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
