import { getWinners } from '../api/winners';
import { WINNERS_AMOUNT_PER_PAGE } from '../utils/constants';
import { QueryKeys } from '../utils/enums';
import { currentWinnersPage, renderWinnersTable } from './winners';

async function getEstimatedPagesNumber(): Promise<number> {
  const winners = await getWinners();

  return Math.ceil(winners.length / WINNERS_AMOUNT_PER_PAGE);
}

async function changePaginationElementsState() {
  const prevPageButton = document.querySelector('.winners__prev') as HTMLButtonElement;
  const nextPageButton = document.querySelector('.winners__next') as HTMLButtonElement;
  const currentPageContainer = document.querySelector('.winners__page') as HTMLElement;
  const estimatedPagesContainer = document.querySelector('.winners__page-all') as HTMLElement;
  const winnersAmountContainer = document.querySelector('.winners__amount') as HTMLElement;

  const allWinners = await getWinners();
  const estimatedPages = await getEstimatedPagesNumber();
  const currentPage = currentWinnersPage.page;

  if (currentPage === 1) {
    prevPageButton.disabled = true;
  } else {
    prevPageButton.disabled = false;
  }

  if (currentPage === estimatedPages) {
    nextPageButton.disabled = true;
  } else if (!allWinners.length) {
    nextPageButton.disabled = true;
  } else {
    nextPageButton.disabled = false;
  }

  currentPageContainer.textContent = allWinners.length ? currentPage.toString() : '0';
  estimatedPagesContainer.textContent = estimatedPages.toString();
  winnersAmountContainer.textContent = allWinners.length.toString();
}

document.addEventListener('click', async (event) => {
  const target = event.target as HTMLButtonElement;

  if (target.matches('.winners__prev') || target.matches('.winners__next')) {
    if (target.matches('.winners__prev') && currentWinnersPage.page !== 1) {
      currentWinnersPage.page -= 1;
    }

    if (target.matches('.winners__next')) {
      const estimatedPages = await getEstimatedPagesNumber();

      if (currentWinnersPage.page !== estimatedPages) {
        currentWinnersPage.page += 1;
      }
    }

    await changePaginationElementsState();

    const winsHeader = document.querySelector('.winners__wins-header') as HTMLElement;
    const timeHeader = document.querySelector('.winners__time-header') as HTMLElement;

    let sort: 'wins' | 'time' | undefined;
    let order: 'DESC' | 'ASC' | undefined;

    if (timeHeader.dataset.sorted === 'true') {
      sort = 'time';
      order = timeHeader.dataset.sortOrder as 'DESC' | 'ASC';
    } else if (winsHeader.dataset.sorted === 'true') {
      sort = 'wins';
      order = winsHeader.dataset.sortOrder as 'DESC' | 'ASC';
    } else {
      sort = undefined;
      order = undefined;
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

export default changePaginationElementsState;
