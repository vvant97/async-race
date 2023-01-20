import { manageCarEngineDriveMode } from '../api/engine';
import { getCars } from '../api/garage';
import { CARS_AMOUNT_PER_PAGE } from '../utils/constants';
import { QueryKeys } from '../utils/enums';
import { CarFullData, RaceMode } from '../utils/types';
import { togglePreloaderOnElements } from '../utils/utils';
import getAnimation, { animationsData } from './carAnimation';
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
      const allStopButtons = document.querySelectorAll('.cars__stop');
      const allSelectsButtons = document.querySelectorAll('.cars__select');
      const allRemoveButtons = document.querySelectorAll('.cars__remove');
      const generateButton = document.querySelector('.garage__generate') as HTMLButtonElement;
      const createButton = document.querySelector('.garage__submit-create') as HTMLButtonElement;
      const nextPageButton = document.querySelector('.cars__next') as HTMLButtonElement;
      const prevPageButton = document.querySelector('.cars__prev') as HTMLButtonElement;

      generateButton.disabled = true;
      createButton.disabled = true;
      nextPageButton.disabled = true;
      prevPageButton.disabled = true;

      togglePreloaderOnElements([
        raceButton,
        ...([...allStartButtons] as HTMLButtonElement[]),
      ]);

      ([...allSelectsButtons, ...allRemoveButtons] as HTMLButtonElement[]).forEach((button) => {
        button.disabled = true;
      });

      const animations = await getAllAnimations('race');

      Promise.all(animations)
        .then((animationsArray) => {
          animationsData.raceMode = true;

          animationsArray.forEach(async (animation) => {
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

          togglePreloaderOnElements([
            raceButton,
            ...([...allStartButtons] as HTMLButtonElement[]),
          ]);

          ([...allStartButtons, ...allStopButtons] as HTMLButtonElement[]).forEach((button) => {
            button.disabled = true;
          });

          raceButton.disabled = true;
          resetButton.disabled = false;
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
