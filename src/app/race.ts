import { manageCarEngineDriveMode } from '../api/engine';
import { getCars } from '../api/garage';
import { CARS_AMOUNT_PER_PAGE } from '../utils/constants';
import { QueryKeys } from '../utils/enums';
import { CarFullData, RaceMode } from '../utils/types';
import { togglePreloaderOnElements } from '../utils/utils';
import getAnimation from './carAnimation';
import { currentCarsPage } from './cars';

async function getAllAnimations(mode: RaceMode) {
  const animations: Promise<Animation>[] = [];
  const cars = await getCars({
    [QueryKeys.PAGE]: currentCarsPage.page,
    [QueryKeys.LIMIT]: CARS_AMOUNT_PER_PAGE,
  }) as CarFullData[];

  cars
    .map((car) => car.id)
    .forEach((id) => {
      if (mode === 'race') {
        const animation = getAnimation(+id, 'start') as Promise<Animation>;
        animations.push(animation as Promise<Animation>);
      } else {
        getAnimation(id, 'reset');
      }
    });

  return animations;
}

function listenRaceEvents() {
  document.addEventListener('click', async (event: Event) => {
    const target = event.target as HTMLButtonElement;

    if (target.classList.contains('garage__race')) {
      const raceButton = event.target as HTMLButtonElement;
      const resetButton = raceButton.nextElementSibling as HTMLButtonElement;
      const allStartButtons = document.querySelectorAll('.cars__start');

      togglePreloaderOnElements([
        raceButton,
        ...([...allStartButtons] as HTMLButtonElement[]),
      ]);

      const animations = await getAllAnimations('race');

      Promise.all(animations)
        .then((animationsArray) => {
          animationsArray.forEach(async (animation) => {
            togglePreloaderOnElements([
              raceButton,
              ...([...allStartButtons] as HTMLButtonElement[]),
            ]);
            raceButton.disabled = true;
            resetButton.disabled = false;

            ([...allStartButtons] as HTMLButtonElement[]).forEach((button) => {
              button.disabled = true;
            });

            animation.play();

            try {
              await manageCarEngineDriveMode({
                [QueryKeys.ID]: +animation.id,
                [QueryKeys.STATUS]: 'drive',
              });
            } catch (error) {
              animation.pause();
            }
          });
        });
    }

    if (target.classList.contains('garage__reset')) {
      const resetButton = event.target as HTMLButtonElement;

      togglePreloaderOnElements([resetButton]);
      getAllAnimations('reset');
    }
  });
}

export default listenRaceEvents;
