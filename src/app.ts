import './style.scss';

import renderPage from './components/pageTemplate';
import listenChangePageView from './app/changeView';
import { listenCarManageEvents } from './app/cars';
import listenCarEngineEvents from './app/carEngine';
import listenRaceEvents from './app/race';
import { listenRemoveOverlay } from './utils/utils';

async function init() {
  await renderPage();
  listenChangePageView();
  listenCarManageEvents();
  listenCarEngineEvents();
  listenRaceEvents();
  listenRemoveOverlay();
}

init();
