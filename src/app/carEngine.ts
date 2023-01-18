import manageCarMode from './carAnimation';

function listenCarEngineEvents() {
  document.addEventListener('click', (event: Event) => {
    const target = event.target as HTMLElement;

    if (target.matches('.cars__start')) {
      const startButton = event.target as HTMLButtonElement;
      const stopButton = startButton.nextElementSibling as HTMLButtonElement;
      const carId = (target.closest('.cars__item') as HTMLElement)
        .dataset.carId as string;

      startButton.disabled = true;
      stopButton.disabled = false;

      manageCarMode(+carId, 'start');
    }

    if (target.matches('.cars__stop')) {
      const stopButton = event.target as HTMLButtonElement;
      const startButton = stopButton.previousElementSibling as HTMLButtonElement;
      const carId = (target.closest('.cars__item') as HTMLElement)
        .dataset.carId as string;

      stopButton.disabled = true;
      startButton.disabled = false;

      manageCarMode(+carId, 'stop');
    }
  });
}

export default listenCarEngineEvents;
