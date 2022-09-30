import { Notify } from 'notiflix';

const paramsFilter = ['name', 'capital', 'population', 'flag', 'languages'];

export const fetchCountries = name => {
  return fetch(
    `https://restcountries.com/v2/name/${name}/?fields=${paramsFilter.join(
      ','
    )}`
  ).then(foundCOuntry => {
    if (!foundCOuntry.ok) {
      Notify.failure('Oops, there is no country with that name');
      throw new Error(foundCOuntry.status);
    }
    return foundCOuntry.json();
  });
};
