import { getCar } from '../api/garage';
import { CarFullData } from '../utils/types';
import { activatePreloaderOnElement } from '../utils/utils';
import startDrive from './carAnimation';

async function getCarElementsData(event: Event) {
  const target = event.target as HTMLElement;
  const container = target.closest('.cars__item') as HTMLLIElement;
  const element = container.querySelector('.car') as HTMLElement;
  const carId = container.dataset.carId as string;
  const car = await getCar(+carId) as CarFullData;

  return {
    element,
    car,
  };
}

function listenCarEngineEvents() {
  document.addEventListener('click', async (event: Event) => {
    const target = event.target as HTMLElement;

    if (target.matches('.cars__start')) {
      const startButton = target as HTMLButtonElement;
      const stopButton = startButton.nextElementSibling as HTMLButtonElement;
      await activatePreloaderOnElement(startButton);

      const { element, car } = await getCarElementsData(event);
      const { id, name, color } = car;

      await startDrive({
        element,
        id,
        name,
        color,
        startButton,
        stopButton,
      });
    }
  });
}

export default listenCarEngineEvents;
