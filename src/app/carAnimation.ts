import { manageCarEngine, manageCarEngineDriveMode } from '../api/engine';
import { QueryKeys } from '../utils/enums';
import { AnimationOptions, RaceMode } from '../utils/types';

export const animationsData: Animation[] = [];

const findAnimation = (id: number): Animation => animationsData
  .filter((animation) => +animation.id === id).at(-1) as Animation;

function calculateCarAnimationEndpoint(target: HTMLElement): number {
  const trackWidth = (target.parentElement as HTMLElement).offsetWidth;
  return trackWidth - (target.offsetWidth + target.offsetLeft);
}

function startAnimation(id: number, options: AnimationOptions): Animation {
  const { target, duration, endpoint } = options;
  const keyframes = [
    { transform: 'translateX(0)' },
    { transform: `translateX(${endpoint}px)` },
  ];
  const animation = target.animate(keyframes, {
    duration,
    fill: 'both',
    id: id.toString(),
  });

  return animation;
}

async function manageCarMode(id: number, mode: RaceMode) {
  const carEngineStat = await manageCarEngine({
    [QueryKeys.ID]: id,
    [QueryKeys.STATUS]: (mode === 'start' || mode === 'race') ? 'started' : 'stopped',
  });
  const carElement = document.querySelector(`.cars__item[data-car-id="${id}"] .car`) as HTMLElement;
  const animationEndpoint = calculateCarAnimationEndpoint(carElement);

  if (mode === 'start' || mode === 'race') {
    const animation = startAnimation(id, {
      target: carElement,
      duration: carEngineStat.distance / carEngineStat.velocity,
      endpoint: animationEndpoint,
    });

    animationsData.push(animation);
    try {
      await manageCarEngineDriveMode({
        [QueryKeys.ID]: id,
        [QueryKeys.STATUS]: 'drive',
      });
    } catch (error) {
      animation.pause();
    }
  } else if (mode === 'stop' || mode === 'reset') {
    const animationToStop = findAnimation(id);

    animationToStop.cancel();
  }
}

export default manageCarMode;
