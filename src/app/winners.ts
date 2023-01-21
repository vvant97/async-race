import {
  createWinner, deleteWinner, getWinner, getWinners, updateWinner,
} from '../api/winners';
import { createWinnerTableItem } from '../components/winnerTemplate';
import { WINNERS_AMOUNT_PER_PAGE } from '../utils/constants';
import { QueryKeys } from '../utils/enums';
import { QueryParams, WinnerFullData, WinnnersSavedData } from '../utils/types';
import { isWinnerExist } from '../utils/utils';

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
    await updateExistingWinnerData({ id, time: winner.time, wins: winner.wins }, time);
  }
}

async function renderWinnersTable(params?: QueryParams, additionalParams?: QueryParams) {
  const allWinners = await getWinners(additionalParams);
  const winners = await getWinners(params);
  const winnersTable = document.querySelector('.winners__body') as HTMLElement;
  const winnersList: HTMLElement[] = [];

  winners.forEach((winner) => {
    const { time, wins, id } = winner;
    const savedWinner = winnnersSavedData.find((object) => object.id === id);
    const number = allWinners.findIndex((object) => object.id === id);

    let name;
    let car;

    if (!savedWinner) {
      const item = document.querySelector(`.cars__item[data-car-id="${id}"]`) as HTMLElement;

      name = (item.querySelector('.cars__car-name') as HTMLElement).textContent as string;
      car = (item.querySelector('.car') as HTMLLIElement).cloneNode(true);

      winnnersSavedData.push({ id, name, car: (car as HTMLElement).innerHTML });
    } else {
      const carContainer = document.createElement('div');

      carContainer.className = 'car';
      carContainer.innerHTML = savedWinner.car;

      name = savedWinner.name;
      car = carContainer;
    }

    const winnerTemplate = createWinnerTableItem({
      wins, time, id: number + 1, car, name,
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

document.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement;

  if (target.matches('.winners__wins-header') || target.matches('.winners__time-header')) {
    const winsIcon = document.querySelector('.winners__wins-icon') as HTMLElement;
    const timeIcon = document.querySelector('.winners__time-icon') as HTMLElement;

    let sort: 'wins' | 'time';
    let order: 'ASC' | 'DESC';

    if (target.matches('.winners__wins-header')) {
      const timeHeader = target.nextElementSibling as HTMLElement;

      sort = 'wins';

      if (target.dataset.sortOrder === 'DESC') {
        order = 'ASC';
        target.dataset.sortOrder = 'ASC';
        winsIcon.innerHTML = '<i class="bi bi-sort-up-alt"></i>';
      } else {
        order = 'DESC';
        target.dataset.sortOrder = 'DESC';
        winsIcon.innerHTML = '<i class="bi bi-sort-up"></i>';
      }

      target.dataset.sorted = 'true';
      timeHeader.dataset.sorted = 'false';
      timeIcon.innerHTML = '';
    } else {
      const winsHeader = target.previousElementSibling as HTMLElement;

      sort = 'time';

      if (target.dataset.sortOrder === 'DESC') {
        order = 'ASC';
        target.dataset.sortOrder = 'ASC';
        timeIcon.innerHTML = '<i class="bi bi-sort-up-alt"></i>';
      } else {
        order = 'DESC';
        target.dataset.sortOrder = 'DESC';
        timeIcon.innerHTML = '<i class="bi bi-sort-up"></i>';
      }

      target.dataset.sorted = 'true';
      winsHeader.dataset.sorted = 'false';
      winsIcon.innerHTML = '';
    }

    await renderWinnersTable(
      {
        [QueryKeys.LIMIT]: WINNERS_AMOUNT_PER_PAGE,
        [QueryKeys.PAGE]: currentWinnersPage.page,
        [QueryKeys.SORT]: sort,
        [QueryKeys.ORDER]: order,
      },
      {
        [QueryKeys.SORT]: sort,
        [QueryKeys.ORDER]: order,
      },
    );
  }
});

export {
  renderWinnersTable,
  updateWinnerData,
  removeWinnerFromList,
};
