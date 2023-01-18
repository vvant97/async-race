import { manageCarEngineDriveMode } from '../api/engine';
import { QueryKeys } from '../utils/enums';
import { togglePreloaderOnElements } from '../utils/utils';
import getAnimation from './carAnimation';

function listenCarEngineEvents() {
  document.addEventListener('click', async (event: Event) => {
    const target = event.target as HTMLElement;

    if (target.matches('.cars__start')) {
      const startButton = event.target as HTMLButtonElement;
      const stopButton = startButton.nextElementSibling as HTMLButtonElement;
      const carId = (target.closest('.cars__item') as HTMLElement)
        .dataset.carId as string;

      togglePreloaderOnElements([startButton]);

      const animation = await getAnimation(+carId, 'start') || undefined;

      if (animation) {
        animation.play();
        togglePreloaderOnElements([startButton]);
        startButton.disabled = true;
        stopButton.disabled = false;

        try {
          await manageCarEngineDriveMode({
            [QueryKeys.ID]: +carId,
            [QueryKeys.STATUS]: 'drive',
          });
        } catch (error) {
          animation.pause();
        }
      }
    }

    if (target.matches('.cars__stop')) {
      const stopButton = event.target as HTMLButtonElement;
      const startButton = stopButton.previousElementSibling as HTMLButtonElement;
      const carId = (target.closest('.cars__item') as HTMLElement)
        .dataset.carId as string;

      togglePreloaderOnElements([stopButton]);

      await getAnimation(+carId, 'stop');
      togglePreloaderOnElements([stopButton]);
      stopButton.disabled = true;
      startButton.disabled = false;
    }
  });
}

export default listenCarEngineEvents;
