import {
  createWinner, deleteWinner, getWinner, getWinners, updateWinner,
} from '../api/winners';
import { createWinnerTableItem } from '../components/winnerTemplate';
import { WINNERS_AMOUNT_PER_PAGE } from '../utils/constants';
import { QueryKeys } from '../utils/enums';
import { QueryParams, WinnerFullData } from '../utils/types';
import { isWinnerExist } from '../utils/utils';

interface WinnnersSavedData {
  id: number,
  name: string;
  car: string;
}

const cachedWinners = JSON.parse(localStorage.getItem('winners') as string);
export const winnnersSavedData: WinnnersSavedData[] = cachedWinners || [];
export const currentWinnersPage = {
  page: 1,
};

async function updateExistingWinnerData(props: WinnerFullData, comparedTime: number) {
  const { id, time, wins } = props;
  const newWinsParameter = wins + 1;

  await updateWinner(id, {
    wins: newWinsParameter,
    time: (comparedTime < time) ? comparedTime : time,
  });
}

async function updateWinnerData(data: WinnerFullData) {
  const { id, time, wins } = data;
  const winner = await getWinner(id);

  if (!isWinnerExist(winner)) {
    await createWinner({ id, time, wins });
  } else {
    await updateExistingWinnerData({ id, time: winner.time, wins }, time);
  }
}

async function renderWinnersTable(params?: QueryParams) {
  const allWinners = await getWinners(params);
  const winnersTable = document.querySelector('.winners__body') as HTMLElement;
  const winnersList: HTMLElement[] = [];

  allWinners.forEach((winner, index) => {
    const { time, wins, id } = winner;
    const savedWinner = winnnersSavedData.find((object) => object.id === id);

    let name;
    let car;

    if (!savedWinner) {
      const item = document.querySelector(`.cars__item[data-car-id="${id}"]`) as HTMLElement;

      name = (item.querySelector('.cars__car-name') as HTMLElement).textContent as string;
      car = (item.querySelector('.car') as HTMLLIElement).cloneNode(true);
    } else {
      const carContainer = document.createElement('div');

      carContainer.className = 'car';
      carContainer.innerHTML = savedWinner.car;

      name = savedWinner.name;
      car = carContainer;
    }

    const winnerTemplate = createWinnerTableItem({
      wins, time, id: index + 1, car, name,
    });

    winnersList.push(winnerTemplate);
  });

  winnersTable.innerHTML = '';
  winnersTable.append(...winnersList);

  localStorage.setItem('winners', JSON.stringify(winnnersSavedData));
}

async function removeWinnerFromList(id: number) {
  const savedWinnerToRemoveIndex = winnnersSavedData.findIndex((object) => object.id === id);

  winnnersSavedData.splice(savedWinnerToRemoveIndex, 1);
  await deleteWinner(id);
  await renderWinnersTable({
    [QueryKeys.LIMIT]: WINNERS_AMOUNT_PER_PAGE,
    [QueryKeys.PAGE]: currentWinnersPage.page,
  });
}

export {
  renderWinnersTable,
  updateWinnerData,
  removeWinnerFromList,
};
