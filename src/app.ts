import './style.scss';

import renderPage from './components/pageTemplate';
import listenChangePageView from './app/changeView';
import { listenCarManageEvents } from './app/cars';
import listenCarEngineEvents from './app/carEngine';
import listenRaceEvents from './app/race';
import { listenRemoveOverlay } from './utils/utils';
import { currentWinnersPage, renderWinnersTable, winnnersSavedData } from './app/winners';
import { WINNERS_AMOUNT_PER_PAGE } from './utils/constants';
import { QueryKeys } from './utils/enums';

window.addEventListener('beforeunload', () => {
  localStorage.setItem('winners', JSON.stringify(winnnersSavedData));
});

async function init() {
  await renderPage();

  listenChangePageView();
  listenCarManageEvents();
  listenCarEngineEvents();
  listenRaceEvents();
  listenRemoveOverlay();

  await renderWinnersTable({
    [QueryKeys.LIMIT]: WINNERS_AMOUNT_PER_PAGE,
    [QueryKeys.PAGE]: currentWinnersPage.page,
  });
}

init();
