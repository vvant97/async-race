import { CarData, CarDataFull } from './types';
import { HttpMethods, Paths, QueryKeys } from './enums';
import { ORIGIN } from './constants';
import generateQueryString from './utils';

async function getCars(limit: number = -1, page: number = -1): Promise<CarDataFull[]> {
  const params = generateQueryString([
    [QueryKeys.LIMIT, limit],
    [QueryKeys.PAGE, page],
  ]);
  const res = await fetch(`${ORIGIN}${Paths.GARAGE}${params}`);
  const cars: CarDataFull[] = await res.json();

  return cars;
}

async function getCar(id: number): Promise<CarDataFull> {
  const res = await fetch(`${ORIGIN}${Paths.GARAGE}/${id}`);
  const car: CarDataFull = await res.json();

  return car;
}

function createCar(body: CarData) {
  fetch(`${ORIGIN}${Paths.GARAGE}`, {
    method: HttpMethods.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

function deleteCar(id: number) {
  fetch(`${ORIGIN}${Paths.GARAGE}/${id}`, {
    method: HttpMethods.DELETE,
  });
}

function updateCar(id: number, body: CarData) {
  fetch(`${ORIGIN}${Paths.GARAGE}/${id}`, {
    method: HttpMethods.PUT,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export {
  getCars,
  getCar,
  createCar,
  deleteCar,
  updateCar,
};
