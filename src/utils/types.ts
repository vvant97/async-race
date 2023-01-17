import { QueryKeys } from './enums';

interface CarData {
  name: string;
  color: string;
}

interface CarFullData extends CarData {
  id: number;
}

interface WinnerData {
  wins: number;
  time: number;
}

interface WinnerFullData extends WinnerData {
  id: number;
}

interface CarEngineStat {
  velocity: number;
  distance: number;
}

interface CarEngineDriveResponse {
  success: true;
}

type WinnersSort = 'id' | 'wins' | 'time';
type WinnersOrder = 'ASC' | 'DESC';
type CarStatus = 'started' | 'stopped' | 'drive';
type ParamValue = number | WinnersSort | WinnersOrder | CarStatus | undefined;

interface QueryParams {
  [QueryKeys.LIMIT]?: number;
  [QueryKeys.PAGE]?: number;
  [QueryKeys.SORT]?: WinnersSort;
  [QueryKeys.ORDER]?: WinnersOrder;
  [QueryKeys.ID]?: number;
  [QueryKeys.STATUS]?: CarStatus;
}

interface PageTemplate {
  carsAmount: number;
  winnersAmount: number;
  carsList: string;
  estimatedCarsPages: number;
}

export {
  CarData,
  CarFullData,
  QueryParams,
  WinnerData,
  WinnerFullData,
  WinnersSort,
  WinnersOrder,
  ParamValue,
  PageTemplate,
  CarStatus,
  CarEngineStat,
  CarEngineDriveResponse,
};
