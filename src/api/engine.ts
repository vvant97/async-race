import { ORIGIN } from '../utils/constants';
import { HttpMethods, Paths } from '../utils/enums';
import { QueryParams, CarEngineStat, CarEngineDriveResponse } from '../utils/types';
import { generateQueryString } from '../utils/utils';

async function manageCarEngine(params: QueryParams): Promise<CarEngineStat | {}> {
  const queryString = generateQueryString(params);
  const res = await fetch(`${ORIGIN}${Paths.ENGINE}${queryString}`, {
    method: HttpMethods.PATCH,
  });
  const engineStat: CarEngineStat | {} = await res.json();

  return engineStat;
}

async function manageCarEngineDriveMode(params: QueryParams): Promise<CarEngineDriveResponse | {}> {
  const queryString = generateQueryString(params);
  const res = await fetch(`${ORIGIN}${Paths.ENGINE}${queryString}`, {
    method: HttpMethods.PATCH,
  });
  const driveMode: CarEngineDriveResponse | {} = await res.json();

  return driveMode;
}

export {
  manageCarEngine,
  manageCarEngineDriveMode,
};
