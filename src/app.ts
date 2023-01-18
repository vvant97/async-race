import './style.scss';

import renderPage from './components/pageTemplate';
import listenChangePageView from './app/changeView';
import { listenCarManageEvents } from './app/cars';
import listenCarEngineEvents from './app/carEngine';
import listenRaceEvents from './app/race';

async function init() {
  await renderPage();
  listenChangePageView();
  listenCarManageEvents();
  listenCarEngineEvents();
  listenRaceEvents();
}

init();
