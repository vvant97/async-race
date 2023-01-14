import { CarData, CarFullData, QueryParams } from '../utils/types';
import { HttpMethods, Paths } from '../utils/enums';
import { ORIGIN } from '../utils/constants';
import generateQueryString from '../utils/utils';

async function getCars(params: QueryParams = {}): Promise<CarFullData[] | []> {
  const queryString = generateQueryString(params);
  const res = await fetch(`${ORIGIN}${Paths.GARAGE}${queryString}`);
  const cars: CarFullData[] = await res.json();

  return cars;
}

async function getCar(id: number): Promise<CarFullData | {}> {
  const res = await fetch(`${ORIGIN}${Paths.GARAGE}/${id}`);
  const car: CarFullData = await res.json();

  return car;
}

async function createCar(body: CarData): Promise<Response> {
  const res = await fetch(`${ORIGIN}${Paths.GARAGE}`, {
    method: HttpMethods.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return res;
}

async function deleteCar(id: number): Promise<Response> {
  const res = await fetch(`${ORIGIN}${Paths.GARAGE}/${id}`, {
    method: HttpMethods.DELETE,
  });

  return res;
}

async function updateCar(id: number, body: CarData): Promise<Response> {
  const res = await fetch(`${ORIGIN}${Paths.GARAGE}/${id}`, {
    method: HttpMethods.PUT,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return res;
}

export {
  getCars,
  getCar,
  createCar,
  deleteCar,
  updateCar,
};
