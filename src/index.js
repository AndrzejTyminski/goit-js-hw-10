import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
//let debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const inputEl = document.getElementById('search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

//inputEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));
inputEl.addEventListener('input', searchCountry);

function searchCountry() {
  const countries = inputEl.value.trim();
  console.log(inputEl.value);
  if (countries === '') {
    dataOutputInfo('');
    dataOutputLi('');
    return;
  }

  fetchCountries(countries)
    .then(countries => {
      renderResult(countries);
    })
    .catch(`blad pobierania danych`);
}

function renderResult(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
  if (countries.length < 10 && countries.length > 2) {
    dataOutputInfo('');
    let markupList = countries
      .map(country => createListCoutry(country))
      .join('');

    return dataOutputLi(markupList);
  }
  if (countries.length == 1) {
    dataOutputLi('');

    const markupInfo = countries.map(country => createMurkup(country)).join('');
    return dataOutputInfo(markupInfo);
  }
}

createListCoutry = country => {
  const {
    name: { common },
    flags: { svg },
  } = country;
  return `
  <li class="coutry-item" style="display: flex; flex-direction: row; align-items:center; ">
  <img style="margin-right: 10px; width:50px; height: 30px; border: 1px solid #ccc;"  src="${svg}" alt="flag" class="coutry-flag" >
  <h2 class="coutry-name">${common}</h2>
  </li>`;
};

createMurkup = country => {
  const {
    name: { official },
    flags: { svg },
    capital,
    population,
    languages,
  } = country;
  return `
  <div style="display:flex; flex-direction:row; align-items: center;">
  <img src="${svg}" alt="flag" style="width:50px; height: 50px; margin-right: 10px; " class="coutry-flag" >
  <h1 class="coutry-name">${official}</h1>
  </div>
  <p class="coutry-text"><b>Capital:</b> ${capital}</p>
  <p class="coutry-text"><b>Population:</b> ${population}</p>
  <p class="coutry-text"><b>Languages:</b> ${Object.values(languages).join(
    ', '
  )}</p>`;
};

dataOutputLi = markup => {
  countryListEl.innerHTML = markup;
};
dataOutputInfo = markup => {
  countryInfoEl.innerHTML = markup;
};

onError = () => {
  dataOutputInfo('');
  dataOutputLi('');
  Notify.failure('Oops, there is no country with that name');
};
