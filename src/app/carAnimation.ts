import { manageCarEngine } from '../api/engine';
import { createWinnerTemplate } from '../components/winnerTemplate';
import { WINNERS_AMOUNT_PER_PAGE } from '../utils/constants';
import { QueryKeys } from '../utils/enums';
import { AnimationOptions, RaceMode } from '../utils/types';
import { getRandomNumber, togglePreloaderOnElements } from '../utils/utils';
import { currentCarsPage, getCarsPagesAmount } from './cars';
import {
  currentWinnersPage,
  renderWinnersTable,
  updateWinnerData,
  winnnersSavedData,
} from './winners';
import changePaginationElementsState from './winnersPagination';

interface AnimationData {
  animations: Animation[];
  finishedAnimations: number;
  maxWinners: number;
  raceMode: boolean;
}

export const animationsData: AnimationData = {
  animations: [],
  finishedAnimations: 0,
  maxWinners: 0,
  raceMode: false,
};

const findAnimation = (id: number): Animation => animationsData.animations
  .filter((animation) => +animation.id === id).at(-1) as Animation;

function calculateCarAnimationEndpoint(target: HTMLElement): number {
  const trackWidth = (target.parentElement as HTMLElement).offsetWidth;
  return trackWidth - (target.offsetWidth + target.offsetLeft);
}

function createAnimation(id: number, options: AnimationOptions): Animation {
  const { target, duration, endpoint } = options;
  const keyframes = new KeyframeEffect(
    target,
    [
      { transform: 'translateX(0)' },
      { transform: `translateX(${endpoint}px)` },
    ],
    { duration, fill: 'forwards' },
  );

  const animation = new Animation(keyframes);
  animation.id = id.toString();
  return animation;
}

async function manageCarsButtonsState() {
  const resetButton = document.querySelector('.garage__reset') as HTMLButtonElement;
  const raceButton = resetButton.previousElementSibling as HTMLButtonElement;
  const allStartButtons = document.querySelectorAll('.cars__start');
  const allSelectsButtons = document.querySelectorAll('.cars__select');
  const allRemoveButtons = document.querySelectorAll('.cars__remove');
  const generateButton = document.querySelector('.garage__generate') as HTMLButtonElement;
  const createButton = document.querySelector('.garage__submit-create') as HTMLButtonElement;
  const nextPageButton = document.querySelector('.cars__next') as HTMLButtonElement;
  const prevPageButton = document.querySelector('.cars__prev') as HTMLButtonElement;

  const pagesAmount = await getCarsPagesAmount();

  generateButton.disabled = false;
  createButton.disabled = false;

  if (currentCarsPage.page === 1) {
    nextPageButton.disabled = false;
  } else if (currentCarsPage.page > 1 && currentCarsPage.page < pagesAmount) {
    nextPageButton.disabled = false;
    prevPageButton.disabled = false;
  } else {
    prevPageButton.disabled = false;
  }

  togglePreloaderOnElements([resetButton]);
  resetButton.disabled = true;
  raceButton.disabled = false;
  ([...allStartButtons] as HTMLButtonElement[]).forEach((button) => {
    button.disabled = false;
  });
  ([...allSelectsButtons, ...allRemoveButtons] as HTMLButtonElement[]).forEach((button) => {
    button.disabled = false;
  });
}

async function startWinnerUpdating(animation: Animation) {
  const { currentTime } = animation;
  const id = +(animation.id as string);
  const time = (currentTime as number) / 1000;
  const wins = 1;

  await updateWinnerData({ id, time, wins });
  await renderWinnersTable({
    [QueryKeys.LIMIT]: WINNERS_AMOUNT_PER_PAGE,
    [QueryKeys.PAGE]: currentWinnersPage.page,
  });
  await changePaginationElementsState();
}

const showWinner = (event: Event) => {
  if (animationsData.maxWinners === 1 && animationsData.raceMode) {
    const target = event.target as Animation;
    const id = +(target.id as string);
    const item = document.querySelector(`.cars__item[data-car-id="${id}"]`) as HTMLElement;
    const name = (item.querySelector('.cars__car-name') as HTMLElement).textContent as string;
    const car = (item.querySelector('.car') as HTMLLIElement).innerHTML;
    const time = target.currentTime as number;
    const winnerTemplate = createWinnerTemplate(name, (time / 1000).toFixed(2));

    document.body.insertAdjacentHTML('beforebegin', winnerTemplate);
    animationsData.raceMode = false;

    winnnersSavedData.push({ id, name, car });
    startWinnerUpdating(target);
  }
};

async function getAnimation(id: number, mode: RaceMode): Promise<Animation | undefined> {
  const carEngineStat = await manageCarEngine({
    [QueryKeys.ID]: id,
    [QueryKeys.STATUS]: (mode === 'start' || mode === 'race') ? 'started' : 'stopped',
  });
  const carElement = document.querySelector(`.cars__item[data-car-id="${id}"] .car`) as HTMLElement;
  const animationEndpoint = calculateCarAnimationEndpoint(carElement);
  const randomSpeedNumber = getRandomNumber(80, 100);

  let animation: Animation | undefined;

  if (mode === 'start' || mode === 'race') {
    animation = createAnimation(id, {
      target: carElement,
      duration: carEngineStat.velocity * randomSpeedNumber,
      endpoint: animationEndpoint,
    });

    animation.addEventListener('finish', (event) => {
      animationsData.maxWinners += 1;
      showWinner(event);
    });

    animationsData.animations.push(animation);
  } else if (mode === 'stop' || mode === 'reset') {
    const animationToStop = findAnimation(id);

    animationToStop.cancel();

    animationsData.animations.forEach((savedAnimation, index) => {
      if (+savedAnimation.id === id) {
        animationsData.animations.splice(index, 1);

        if (mode === 'reset') {
          if (!animationsData.animations.length) {
            manageCarsButtonsState();
          }

          animationsData.maxWinners = 0;
        }
      }
    });
  }

  return animation;
}

export default getAnimation;
