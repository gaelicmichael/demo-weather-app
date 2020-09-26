/***
 * Keeps global context about weather:
 *   cities: [ { name: STRING, temp: NUMBER, weather: STRING } ]
 *   citySelected: INTEGER
 */

import React, { useReducer, createContext } from "react";

export const WeatherContext = createContext();

const maxNumCities = 8;

const reducer = (state, action) => {
  let cityListClone = state.cities.slice();

  switch(action.type) {
  case 'SELECT_CITY':
    return { ...state, citySelected: action.payload };
  case 'ADD_CITY':
    if (cityListClone.length === maxNumCities) {
      cityListClone.splice(maxNumCities-1, 1);
    }
    cityListClone.splice(0, 0, action.payload);
    return { ...state, citySelected: -1, cities: cityListClone };
  case 'REFRESH_CITY':
    const thisCity = cityListClone[action.payload.index];
    thisCity.temp = action.payload.temp;
    thisCity.weather = action.payload.weather;
    return { ...state, cities: cityListClone };
  case 'DELETE_CITY':
    cityListClone.splice(action.payload, 1);
    return { ...state, citySelected: -1, cities: cityListClone };
  case 'CLEAR_ALL':
    return { ...state, citySelected: -1, cities: [] };

  default:
    throw new Error();
  }
}

export function WeatherContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, props.initialState);

  return (
    <WeatherContext.Provider value={[state, dispatch]}>
      {props.children}
    </WeatherContext.Provider>
  );
};
