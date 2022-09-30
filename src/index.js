import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener('input', debounce(callback, DEBOUNCE_DELAY));

function callback(ev) {
  if (!countryInput.value) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(countryInput.value.trim())
    .then(findedCountry => {
      //limit of input
      if (findedCountry.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (findedCountry.length <= 10 && findedCountry.length >= 2) {
        return findedCountry
          .map(el => {
            return countryListMarkup({
              countryPlural: true,
              flagLink: el.flag,
              countryName: el.name,
            });
          })
          .join('');
      } else {
        const obj = {
          list: '',
          info: '',
        };
        obj.list = countryListMarkup({
          flagLink: findedCountry[0].flag,
          countryName: findedCountry[0].name,
        });
        obj.info = countryInfoMarkup({
          capital: findedCountry[0].capital,
          population: findedCountry[0].population,
          languages: parseLangs(findedCountry[0].languages),
        });

        return obj;
      }
    })
    .then(parsed => {
      if (typeof parsed === 'object') {
        countryList.innerHTML = parsed[Object.keys(parsed)[0]];
        countryInfo.innerHTML = parsed[Object.keys(parsed)[1]];
        return;
      } else if (parsed) {
        countryList.innerHTML = parsed;
        countryInfo.innerHTML = '';
        return;
      }
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    })
    .catch(er => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    });
}

function parseLangs(languages) {
  return languages.reduce((acc, el, ind, arr) => {
    if (ind === arr.length - 1) {
      return (acc += el.name);
    }
    return (acc += el.name + ', ');
  }, '');
}

function countryListMarkup({ countryPlural, flagLink, countryName } = {}) {
  let textTag = 'h1';
  let flagSize = 12;
  if (countryPlural) {
    textTag = 'span';
    flagSize = 0;
  }
  return `<li class="country-item"><img class="flag" width='${
    26 + flagSize
  }' src="${flagLink}"><${textTag}>${countryName}</${textTag}></li>`;
}

function countryInfoMarkup({ capital, population, languages } = {}) {
  return `<ul>
          <li><h2>Capital: </h2><span>${capital}</span></li>
          <li><h2>Population: </h2><span>${population}</span></li>
          <li><h2>Languages: </h2><span>${languages}</span></li>
          </ul>`;
}
