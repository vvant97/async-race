import { CarData, CarFullData, QueryParams } from './types';
import { HttpMethods, Paths } from './enums';
import { ORIGIN } from './constants';
import generateQueryString from './utils';

async function getCars(params: QueryParams = {}): Promise<CarFullData[]> {
  const queryString = generateQueryString(params);
  const res = await fetch(`${ORIGIN}${Paths.GARAGE}${queryString}`);
  const cars: CarFullData[] = await res.json();

  return cars;
}

async function getCar(id: number): Promise<CarFullData> {
  const res = await fetch(`${ORIGIN}${Paths.GARAGE}/${id}`);
  const car: CarFullData = await res.json();

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
