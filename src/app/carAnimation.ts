import { manageCarEngine } from '../api/engine';
import { QueryKeys } from '../utils/enums';
import { AnimationOptions, RaceMode } from '../utils/types';
import { getRandomNumber, togglePreloaderOnElements } from '../utils/utils';

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

function manageCarsButtonsState() {
  const resetButton = document.querySelector('.garage__reset') as HTMLButtonElement;
  const raceButton = resetButton.previousElementSibling as HTMLButtonElement;
  const allStartButtons = document.querySelectorAll('.cars__start');

  togglePreloaderOnElements([resetButton]);
  resetButton.disabled = true;
  raceButton.disabled = false;
  ([...allStartButtons] as HTMLButtonElement[]).forEach((button) => {
    button.disabled = false;
  });
}

const showWinner = (event: Event) => {
  if (animationsData.maxWinners === 1 && animationsData.raceMode) {
    const target = event.target as Animation;
    const carId = target.id as string;

    animationsData.raceMode = false;
    console.log(carId);
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
