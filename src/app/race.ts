import { getCars } from '../api/garage';
import { CARS_AMOUNT_PER_PAGE } from '../utils/constants';
import { QueryKeys } from '../utils/enums';
import { CarFullData, RaceMode } from '../utils/types';
import manageCarMode from './carAnimation';
import { currentCarsPage } from './cars';

async function manageRaceMode(mode: RaceMode) {
  const cars = await getCars({
    [QueryKeys.PAGE]: currentCarsPage.page,
    [QueryKeys.LIMIT]: CARS_AMOUNT_PER_PAGE,
  }) as CarFullData[];

  cars
    .map((car) => car.id)
    .forEach((carId) => {
      if (mode === 'race') {
        manageCarMode(carId, 'race');
      } else {
        manageCarMode(carId, 'reset');
      }
    });
}

function listenRaceEvents() {
  document.addEventListener('click', (event: Event) => {
    const target = event.target as HTMLButtonElement;

    if (target.classList.contains('garage__race')) {
      const rcaeButton = event.target as HTMLButtonElement;
      const resetButton = rcaeButton.nextElementSibling as HTMLButtonElement;

      rcaeButton.disabled = true;
      resetButton.disabled = false;

      manageRaceMode('race');
    }

    if (target.classList.contains('garage__reset')) {
      const resetButton = event.target as HTMLButtonElement;
      const raceButton = resetButton.previousElementSibling as HTMLButtonElement;

      resetButton.disabled = true;
      raceButton.disabled = false;

      manageRaceMode('reset');
    }
  });
}

export default listenRaceEvents;
