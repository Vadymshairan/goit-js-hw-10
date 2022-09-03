import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

// fetchCountries('Ukr').then(countries => {
//   console.log(countries);
// });
refs.input.addEventListener('input', debounce(onInputCountry, DEBOUNCE_DELAY));

function onInputCountry(e) {
  e.preventDefault();

  const inputValue = e.target.value.trim();
  dataClear();
  if (inputValue !== '') {
    fetchCountries(inputValue)
      .then(countries => {
        if (countries.length > 10) {
          alertTooManyCountries();
          dataClear();
          return;
        } else if (countries.length === 1) {
          dataClear();
          refs.countryInfo.insertAdjacentHTML(
            'beforeend',
            renderCountryCard(countries)
          );
        } else if (countries.length > 1 && countries.length <= 10) {
          dataClear();
          refs.countryList.insertAdjacentHTML(
            'beforeend',
            renderCountriesList(countries)
          );
        }
      })
      .catch(error => {
        dataClear();
        alertCountryNotFound();
      });
  }
}

function renderCountryCard(countries) {
  return countries
    .map(
      ({ name, capital, population, flags, languages }) =>
        ` <div class = "country-item">
        <img class = "country-item__img" src="${flags.svg}" alt="${
          name.official
        }" width ='50' height = '30'>
        <h3
         class="country-text">${name.official}</h3>
        </div>
        <p><b>Capital:</b> ${capital}</p>
        <p><b>Population:</b> ${population}</p>
        <p"><b>Languages:</b> ${Object.values(languages)} </p>`
    )
    .join();
}

function renderCountriesList(countries) {
  return countries
    .map(
      ({ name, flags }) =>
        `<li class="country-item"><img src="${flags.png}" alt="${name.official}" width='32' height = '20'>
        <p class="country-text">${name.official}</p></li>`
    )
    .join('');
}

function alertCountryNotFound() {
  Notify.failure('Oops, there is no country with that name', {
    position: 'center-center',
  });
}

function alertTooManyCountries() {
  Notify.info('Too many matches found. Please enter a more specific name.', {
    position: 'center-center',
  });
}

function dataClear() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
