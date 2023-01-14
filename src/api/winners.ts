import { WinnerData, WinnerFullData, QueryParams } from '../utils/types';
import { HttpMethods, Paths, ContentTypes } from '../utils/enums';
import { ORIGIN } from '../utils/constants';
import generateQueryString from '../utils/utils';

async function getWinners(params: QueryParams = {}): Promise<WinnerFullData[] | []> {
  const queryString = generateQueryString(params);
  const res = await fetch(`${ORIGIN}${Paths.WINNERS}${queryString}`);
  const winners: WinnerFullData[] | [] = await res.json();

  return winners;
}

async function getWinner(id: number): Promise<WinnerFullData | {}> {
  const res = await fetch(`${ORIGIN}${Paths.WINNERS}/${id}`);
  const winner: WinnerFullData | {} = await res.json();

  return winner;
}

async function createWinner(body: WinnerFullData): Promise<Response> {
  const res = await fetch(`${ORIGIN}${Paths.WINNERS}`, {
    method: HttpMethods.POST,
    headers: {
      'Content-Type': ContentTypes.JSON,
    },
    body: JSON.stringify(body),
  });

  return res;
}

async function deleteWinner(id: number): Promise<Response> {
  const res = await fetch(`${ORIGIN}${Paths.WINNERS}/${id}`, {
    method: HttpMethods.DELETE,
  });

  return res;
}

async function updateWinner(id: number, body: WinnerData): Promise<Response> {
  const res = await fetch(`${ORIGIN}${Paths.WINNERS}/${id}`, {
    method: HttpMethods.PUT,
    headers: {
      'Content-Type': ContentTypes.JSON,
    },
    body: JSON.stringify(body),
  });

  return res;
}

export {
  getWinners,
  getWinner,
  createWinner,
  deleteWinner,
  updateWinner,
};
