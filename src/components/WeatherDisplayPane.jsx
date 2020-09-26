/***
 * WeatherDisplayPane - Pane on which to display selected city and weather for it
 * 
 * Details about API to get forecast
 *   https://openweathermap.org/forecast16
 * Details about how to get icon for weather conditions
 *   https://openweathermap.org/weather-conditions

 * forecast variables: icon, temp, weather, wind, pressure, days: [ { date, day, icon, temp } ]
 */

import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CachedIcon from '@material-ui/icons/Cached';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { WeatherContext } from '../WeatherContext';

const numDaysForecast = 6;

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
  },
  bigWeatherIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: 'lightblue',
    border: '1px white dotted',
  },
  miniWeatherIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: 'lightblue',
    border: '1px white dotted',
  },
  eachDay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
}));

function WeatherDisplayPane() {
  const paneClasses = useStyles();
  const [weatherState] = useContext(WeatherContext);

  const hasSelection = weatherState.citySelected !== -1;
  const cityName = hasSelection ? weatherState.cities[weatherState.citySelected].name : '';

  const [icon, setIcon] = useState('#');
  const [temp, setTemp] = useState('');
  const [weather, setWeather] = useState('');
  const [wind, setWind] = useState('');
  const [pressure, setPressure] = useState('');
  const [days, setDays] = useState([]);

  function fetchCityData() {
    if (hasSelection) {
      const URLparams = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=${numDaysForecast}&appid=c51223c219d6aec8cb8c5210449bd859&units=metric`;
      fetch(URLparams)
      .then(response => response.json())
      .then(function(apiData) {
console.log('API returned ', apiData);
        if ((apiData.cod === 200) || (apiData.cod === '200')) {
          let thisDay = apiData.list[0];
          setIcon(thisDay.weather[0].icon);
          setTemp(thisDay.main.temp);
          setWeather(thisDay.weather[0].main);
          setWind(thisDay.wind.speed + ' ' + thisDay.wind.deg);
          setPressure(thisDay.main.pressure);
          let newDays = [];

          for (let dayI = 1; dayI < numDaysForecast; dayI++) {
            thisDay = apiData.list[dayI];
            newDays.push({ day: 'Someday', date: dayI, icon: thisDay.weather[0].icon, temp: thisDay.main.temp });
          }
          setDays(newDays);
        }
      });
    }
  }

  useEffect(fetchCityData, [weatherState.citySelected]);

  return (
    <div className={paneClasses.wrapper}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography variant="h5" noWrap>
            { cityName }
          </Typography>
        </Grid>
        <Grid item xs={5} />
        <Grid item xs={1}>
          <CachedIcon fontSize="small" className={paneClasses.iconBtn} onClick={fetchCityData} />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          { (hasSelection && (icon !== '#'))  &&
            <img className={paneClasses.bigWeatherIcon} alt={weather} src={`http://openweathermap.org/img/wn/${icon}@2x.png`} />
          }
        </Grid>
        <Grid item xs={6}>
          { hasSelection &&
            <List>
              <ListItem>
                <ListItemText primary={`${temp}C`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={weather} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Wind: ${wind} deg`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Pressure: ${pressure}`} />
              </ListItem>
            </List>
          }
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        { (hasSelection && (days.length > 0)) &&
          days.map((thisDay) => 
            <Grid item xs={2} className={paneClasses.eachDay} key={thisDay.date}>
              <div>{ thisDay.day }</div>
              <div>{ thisDay.date }</div>
              <div>
                <img className={paneClasses.miniWeatherIcon} alt={thisDay.temp} src={`http://openweathermap.org/img/wn/${thisDay.icon}@2x.png`} />
              </div>
              <div>{ `${thisDay.temp}C` }</div>
            </Grid>
          )
        }
      </Grid>
    </div>
  )
}

export default WeatherDisplayPane;
