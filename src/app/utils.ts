import { QueryParams } from './types';
import { QUERY_PARAM_MIN_VALUE } from './constants';

function generateQueryString(params: QueryParams[]): string {
  const queryString = params
    .filter((param) => {
      const paramValue = param[1];

      return paramValue >= QUERY_PARAM_MIN_VALUE;
    })
    .map((param) => param.join('='))
    .join('&');

  return queryString ? `?${queryString}` : '';
}

export default generateQueryString;
