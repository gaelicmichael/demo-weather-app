/***
 * Weather App demo
 * Michael Newton, 2020
 */

import React from 'react';

// Material-UI
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';

//===============================
// Components defined by this App
import CitiesPane from './components/CitiesPane.jsx';
import WeatherDisplayPane from './components/WeatherDisplayPane.jsx';
import { WeatherContextProvider } from './WeatherContext';

// Data
// 
const initialState = {
  cities: [
    { name: 'London', temp: 12, weather: 'Cloudy' },
    { name: 'New York', temp: 5, weather: 'Cloudy' },
    { name: 'Halifax', temp: 18, weather: 'Sunny' },
  ],
  citySelected: -1,
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  content: {
  },
}));

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});


function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <WeatherContextProvider initialState={initialState}>
        <div className={classes.root}>
          <CssBaseline />
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <CitiesPane />
            </Grid>
            <Grid item xs={8}>
              <WeatherDisplayPane />
            </Grid>
          </Grid>
        </div>
      </WeatherContextProvider>
    </ThemeProvider>
  );
}

export default App;
