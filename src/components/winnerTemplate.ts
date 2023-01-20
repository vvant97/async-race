import { WinnerDataExtended } from '../utils/types';

function createWinnerTemplate(name: string, seconds: string): string {
  const template = `
    <div class="overlay">
      <div class="winner">
        <p class="winner__message">${name} finished first in ${seconds} seconds</p>
      </div>
    </div>
  `;

  return template;
}

function createWinnerTableItem(data: WinnerDataExtended): HTMLTableRowElement {
  const {
    id, name, car, time, wins,
  } = data;

  const carTD = document.createElement('td');
  carTD.append(car);

  const winnerTR = document.createElement('tr');

  winnerTR.insertAdjacentHTML('beforeend', `<td>${id}</td>`);
  winnerTR.append(car);
  winnerTR.insertAdjacentHTML('beforeend', `<td>${name}</td>`);
  winnerTR.insertAdjacentHTML('beforeend', `<td>${wins}</td>`);
  winnerTR.insertAdjacentHTML('beforeend', `<td>${time.toFixed(2)}</td>`);

  return winnerTR;
}

export {
  createWinnerTemplate,
  createWinnerTableItem,
};
