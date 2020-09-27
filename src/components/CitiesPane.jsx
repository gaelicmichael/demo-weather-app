/***
 * CitiesPane -- Pane to allow entering a city name, adding it to the list,
 *                 listing up to 8 entries, choosing a city …
 */

// URL = http://api.openweathermap.org/data/2.5/weather?q=London&appid=c51223c219d6aec8cb8c5210449bd859&units=metric
// Error from weather API looks like this: {"cod":"404","message":"city not found"}
// Good data looks like: {"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"base":"stations","main":{"temp":8.99,"feels_like":3.87,"temp_min":7.78,"temp_max":10,"pressure":1000,"humidity":76},"visibility":10000,"wind":{"speed":5.7,"deg":250},"clouds":{"all":0},"dt":1600908871,"sys":{"type":1,"id":1414,"country":"GB","sunrise":1600926619,"sunset":1600970073},"timezone":3600,"id":2643743,"name":"London","cod":200}

import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CachedIcon from '@material-ui/icons/Cached';
import ClearIcon from '@material-ui/icons/Clear';

import { WeatherContext } from '../WeatherContext';

const useStyles = makeStyles((theme) => ({
  cityWrapper: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    border: '1px grey dotted',
  },
  formWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  entryWrapper: {
  },
  cityNameEntry: {
  },
  iconBtn: {
    cursor: 'pointer',
    border: '1px dotted white',
  },
  recentLocs: {
    fontSize: '14px',
    color: 'grey',
    borderBottom: '1px grey dotted',
  },
  cityRow: {
    borderBottom: '1px white dotted',
  },
  cityText: {
    cursor: 'pointer',
    marginRight: '4px',
  },
  cityActive: {
    backgroundColor: 'white',
    color: 'black',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    position: 'absolute',
    width: 450,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function CitiesPane() {
  const paneClasses = useStyles();
  const [weatherState, weatherDispatch] = useContext(WeatherContext);
  const [cityName, setCityName] = useState('');
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);

  const modalPosStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };
  
  function updateCityName(event) {
    setCityName(event.target.value);
  }

  function clickAddCity() {
    const tryCity = cityName.trim();
    if (tryCity.length === 0) {
      return;
    }
    const URLparams = `http://api.openweathermap.org/data/2.5/weather?q=${tryCity}&appid=c51223c219d6aec8cb8c5210449bd859&units=metric`;
    fetch(URLparams)
      .then(response => response.json())
      .then(function(apiData) {
        if (apiData.cod !== 200) {
          setErrorModalIsOpen(true);
        } else {
          const newCityData = { name: tryCity, temp: apiData.main.temp, weather: apiData.weather[0].main };
          weatherDispatch({ type: 'ADD_CITY', payload: newCityData });
          setCityName('');
        }
      });
  } // clickAddCity()

  function clickOnCity(cityIndex) {
    weatherDispatch({ type: 'SELECT_CITY', payload: cityIndex });
  } // clickOnCity()

  function clickRefreshCity(cityIndex) {
    const cityName = weatherState.cities[cityIndex].name;
    const URLparams = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=c51223c219d6aec8cb8c5210449bd859&units=metric`;
    fetch(URLparams)
      .then(response => response.json())
      .then(function(apiData) {
        if (apiData.cod !== 200) {
          setErrorModalIsOpen(true);
        } else {
          const newCityData = { index: cityIndex, temp: apiData.main.temp, weather: apiData.weather[0].main };
          weatherDispatch({ type: 'REFRESH_CITY', payload: newCityData });
        }
      });
  } // clickRefreshCity()

  function clickRemoveCity(cityIndex) {
    weatherDispatch({ type: 'DELETE_CITY', payload: cityIndex });
  } // clickRemoveCity()

  function clickClear() {
    weatherDispatch({ type: 'CLEAR_ALL' });
  }

  function handleCloseModal() {
    setErrorModalIsOpen(false);
  }

  return (
    <div className={paneClasses.cityWrapper}>
      <form noValidate autoComplete="off" className={paneClasses.formWrapper}>
        <div className={paneClasses.entryWrapper}>
          <TextField id="cityname" className={paneClasses.cityNameEntry} label="Type city name"
                     value={cityName} onChange={updateCityName} />
          <AddIcon fontSize="small" className={paneClasses.iconBtn} onClick={clickAddCity} />
        </div>
      </form>
      <div className={paneClasses.recentLocs}>Recent locations</div>
      <List dense={true}>
      { weatherState.cities.map((thisCity, cityIndex) => {
        let classIfSelected = paneClasses.cityText;
        if (cityIndex === weatherState.citySelected) {
          classIfSelected += ' ' + paneClasses.cityActive;
        }
        return (
          <ListItem className={paneClasses.cityRow} key={thisCity.name}>
            <ListItemText className={classIfSelected} onClick={() => clickOnCity(cityIndex)}
                primary={ `${thisCity.name} - ${thisCity.temp}C ${thisCity.weather}`} />
            <ListItemIcon>
              <CachedIcon fontSize="small" className={paneClasses.iconBtn} onClick={() => clickRefreshCity(cityIndex)} />
            </ListItemIcon>
            <ListItemIcon>
              <ClearIcon fontSize="small" className={paneClasses.iconBtn} onClick={() => clickRemoveCity(cityIndex)} />
            </ListItemIcon>
          </ListItem>
        )
      })}
      </List>
      <Grid container direction="row" justify="flex-end" alignItems="flex-end">
        <Button variant="contained" onClick={clickClear}>Clear</Button>
      </Grid>
      <Modal className={paneClasses.modal} open={errorModalIsOpen} onClose={handleCloseModal} aria-labelledby="Error">
        <div style={modalPosStyle} className={paneClasses.modalPaper}>
          The city {cityName} cannot be found. Please try again with another name.
        </div>
      </Modal>
    </div>
  )
} // CitiesPane()

export default CitiesPane;
