import './style.css';

const API = 'http://api.apixu.com/v1/current.json?key=edeac5d78a6b425c9d1180209181912&q=';
const buttonFind = document.querySelector('.button-find');
const buttonMyWeather = document.querySelector('.button-myWeather');
const buttonClear = document.querySelector('.button-clear');
const inputField = document.querySelector('.input-class');
const ourInput = document.querySelector('.input-class');
const tbody = document.querySelector('tbody');
const tableHead = '<tr><th>City</th><th>Country</th><th>t, °C</th><th>t, °F</th><th>Last update</th></tr>';

function getWeatherByLocation() {
  navigator.geolocation.getCurrentPosition(successF, errorF);
  function successF(position) {
    inputField.value = ''; // clear the input field when we're searching for weather by our location
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const location = `${lat}, ${lng}`;
    getWeatherByNameOfCity(location);
  }
  function errorF() {
    alert('Your location unavailable');
  }
}

function getWeatherByNameOfCity(currentLocation) {
  if (!checkForRepeats(ourInput.value)) {
    const ourURL = `${API}${ourInput.value || currentLocation}`;
    fetch(ourURL)
      .then(response => response.json())
      .then((data) => {
        if (!checkForRepeats(data.location.name)) {
          addDataToTheTable(data);
          saveToLocalStorage(data);
        }
      })
      .catch(error => alert(error));
  }
}

function createTableRow(array) {
  const tr = document.createElement('tr');

  array.forEach((item) => {
    const td = document.createElement('td');
    td.innerText = item;
    tr.appendChild(td);
  });

  tbody.appendChild(tr);
}

function clearTableAndLocalStorage() {
  tbody.innerHTML = '';
  localStorage.clear();
}

function addDataToTheTable(data) {
  const arrayWithData = [];
  arrayWithData.push(
    data.location.name,
    data.location.country,
    data.current.temp_c,
    data.current.temp_f,
    data.current.last_updated,
  );
  if (tbody.children.length == 0) {
    tbody.innerHTML = tableHead;
    createTableRow(arrayWithData);
  } else {
    createTableRow(arrayWithData);
  }
}

function clickByEnter() {
  if (event.keyCode === 13) {
    buttonFind.click();
  }
}

function checkForRepeats(city) {
  const rows = [...tbody.children]; // destructurization of HTML Collection of rows into array of rows
  rows.shift(); // delete the first row (head of table)
  return rows.some((item) => {
    const cellsOfOneRow = [...item.children]; // destructurization of HTML Collection of cells of one row into array of cells of one row
    return cellsOfOneRow[0].textContent.toLowerCase() === city.toLowerCase();// compare value of the first cell of each row with name of city from response
  });
}

function saveToLocalStorage(data) {
  localStorage.setItem(data.location.name.toLowerCase(), JSON.stringify(data));
}

function getItemFromLocalStorage(city) {
  const cityData = localStorage.getItem(city);
  return JSON.parse(cityData);
}

if (!navigator.onLine) {
  for (const key in localStorage) {
    const cityData = getItemFromLocalStorage(key);
    addDataToTheTable(cityData);
  }
}

buttonFind.addEventListener('click', getWeatherByNameOfCity);
buttonMyWeather.addEventListener('click', getWeatherByLocation);
buttonClear.addEventListener('click', clearTableAndLocalStorage);
inputField.addEventListener('keypress', clickByEnter);
