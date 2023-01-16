import './style.scss';

import renderPage from './components/pageTemplate';
import listenChangePageView from './app/changeView';
import { listenCarManageEvents } from './app/cars';

async function init() {
  await renderPage();
  listenChangePageView();
  listenCarManageEvents();
}

init();
