import {
  QueryParams,
  WinnersSort,
  WinnersOrder,
  ParamValue,
} from './types';
import { CAR_MODELS, CAR_NAMES, QUERY_PARAM_MIN_VALUE } from './constants';

const isObjectEmpty = (obj: {}): boolean => Object.keys(obj).length === 0;
const isWinnerSort = (value: unknown): value is WinnersSort => value === 'id' || value === 'wins' || value === 'time';
const isWinnerOrder = (value: unknown): value is WinnersOrder => value === 'ASC' || value === 'DESC';

function generateQueryString(params: QueryParams): string {
  if (isObjectEmpty(params)) {
    return '';
  }

  const entries: [string, ParamValue][] = Object.entries(params);
  const queryString = entries
    .filter((param) => {
      const paramValue = param[1];

      if (paramValue === undefined) {
        return false;
      }

      if (!isWinnerSort(paramValue) && !isWinnerOrder(paramValue)) {
        return paramValue >= QUERY_PARAM_MIN_VALUE;
      }

      return true;
    })
    .map((param) => param.join('='))
    .join('&');

  return queryString ? `?${queryString}` : '';
}

function getRandomNumber(min: number, max: number): number {
  const minValue = Math.ceil(min);
  const maxValue = Math.floor(max);

  return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
}

function getRandomCarName(): string {
  const carNameRandomIndex = getRandomNumber(0, 9);
  const carModelRandomIndex = getRandomNumber(0, 9);

  return `${CAR_NAMES[carNameRandomIndex]} ${CAR_MODELS[carModelRandomIndex]}`;
}

function getRandomColor(): string {
  const letters = '0123456789ABCDE';
  let color = '#';

  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 15)];
  }

  return color;
}

export {
  generateQueryString,
  getRandomCarName,
  getRandomColor,
};
