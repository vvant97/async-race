import { QueryKeys } from './enums';

interface CarData {
  name: string;
  color: string;
}

interface CarFullData extends CarData {
  id: number;
}

interface DriveCarData {
  element: HTMLElement;
  startButton: HTMLButtonElement;
  stopButton: HTMLButtonElement;
  id: number;
}

interface DriveCarFullData extends DriveCarData, CarData {}

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

interface AnimationOptions {
  target: HTMLElement;
  duration: number;
  endpoint: number;
}

interface AnimationEndpointElements {
  track: HTMLElement;
  buttonsContainer: HTMLElement;
  car: HTMLElement;
}

type RaceMode = 'start' | 'stop' | 'race' | 'reset';

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
  DriveCarData,
  DriveCarFullData,
  AnimationOptions,
  AnimationEndpointElements,
  RaceMode,
};
