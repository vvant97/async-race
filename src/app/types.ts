interface CarData {
  name: string;
  color: string;
}

interface CarDataFull extends CarData {
  id: number;
}

type QueryParams = [string, number];

export {
  CarData,
  CarDataFull,
  QueryParams,
};
