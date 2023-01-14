import {
  QueryParams,
  WinnersSort,
  WinnersOrder,
  ParamValue,
} from './types';
import { QUERY_PARAM_MIN_VALUE } from './constants';

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

export default generateQueryString;
