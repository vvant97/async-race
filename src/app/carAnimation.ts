import { manageCarEngine, manageCarEngineDriveMode } from '../api/engine';
import { QueryKeys } from '../utils/enums';
import { DriveCarData, DriveCarFullData } from '../utils/types';
import { activatePreloaderOnElement, deactivatePreloaderOnElement } from '../utils/utils';

function createAnimation(target: HTMLElement, duration: number, endPoint: number): Animation {
  const effect = new KeyframeEffect(
    target,
    [
      { transform: 'translateX(0)' },
      { transform: `translateX(${endPoint}px)` },
    ],
    { duration, fill: 'forwards' },
  );
  const animation = new Animation(effect);

  return animation;
}

function calculateAnimationEndpoint(): number {
  const ELEMENTS_GAP = 10;
  const carTrack = document.querySelector('.cars__track') as HTMLElement;
  const carButtonsContainer = document.querySelector('.cars__state') as HTMLElement;
  const car = document.querySelector('.car') as HTMLElement;

  return carTrack.clientWidth - (carButtonsContainer.clientWidth + car.clientWidth + ELEMENTS_GAP);
}

async function stopDrive(carData: DriveCarData, animation: Animation) {
  const {
    element,
    stopButton,
    startButton,
  } = carData;

  await activatePreloaderOnElement(stopButton);

  await manageCarEngine({
    [QueryKeys.ID]: carData.id,
    [QueryKeys.STATUS]: 'stopped',
  });

  await deactivatePreloaderOnElement(stopButton);

  animation.cancel();
  element.style.transform = 'translateX(0)';
  stopButton.disabled = true;
  startButton.disabled = false;
}

async function startDrive(carData: DriveCarFullData) {
  const {
    element: car,
    stopButton,
    startButton,
    id,
  } = carData;

  const engineStat = await manageCarEngine({
    [QueryKeys.ID]: id,
    [QueryKeys.STATUS]: 'started',
  });

  const duration = engineStat.distance / engineStat.velocity;
  const endPoint = calculateAnimationEndpoint();
  const animation = createAnimation(car, duration, endPoint);

  animation.addEventListener('finish', () => {
    car.style.transform = `translateX(${endPoint}px)`;
  });

  stopButton.addEventListener('click', async () => {
    await stopDrive(
      {
        element: car,
        stopButton,
        startButton,
        id,
      },
      animation,
    );
  });

  animation.play();
  stopButton.disabled = false;
  await deactivatePreloaderOnElement(startButton);
  startButton.disabled = true;

  try {
    await manageCarEngineDriveMode({
      [QueryKeys.ID]: carData.id,
      [QueryKeys.STATUS]: 'drive',
    });
  } catch (error) {
    animation.pause();
  }
}

export default startDrive;
