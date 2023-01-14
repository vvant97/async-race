import { QueryKeys } from './enums';

interface CarData {
  name: string;
  color: string;
}

interface CarFullData extends CarData {
  id: number;
}

type WinnersSort = 'id' | 'wins' | 'time';
type WinnersOrder = 'ASC' | 'DESC';

interface QueryParams {
  [QueryKeys.LIMIT]?: number;
  [QueryKeys.PAGE]?: number;
  [QueryKeys.SORT]?: WinnersSort;
  [QueryKeys.ORDER]?: WinnersOrder;
}

export {
  CarData,
  CarFullData,
  QueryParams,
};
