import {
  getCars,
  createCar,
  deleteCar,
  getCar,
  updateCar,
} from '../api/garage';

import { activatePreloaderOnElement, deactivatePreloaderOnElement } from '../utils/utils';
import createCarTemplate from '../components/carTemplate';
import { CARS_AMOUNT_PER_PAGE } from '../utils/constants';
import { QueryKeys } from '../utils/enums';
import { CarFullData } from '../utils/types';
import createOneHundredRandomCars from './randomCars';

export const currentCarsPage = {
  page: 1,
};

async function setGarageCarsAmount() {
  const carsAmount = document.querySelector('.cars__amount') as HTMLElement;
  const cars = await getCars();
  carsAmount.textContent = cars.length.toString();
}

async function createCarsInitContainer(): Promise<string> {
  const cars = await getCars({
    [QueryKeys.LIMIT]: CARS_AMOUNT_PER_PAGE,
    [QueryKeys.PAGE]: 1,
  });

  return cars
    .map((car) => {
      const { name, color, id } = car;
      return createCarTemplate({ name, color, id });
    })
    .reduce((template, car) => template + car, '');
}

async function appendCarToCarsList() {
  const carsList = document.querySelector('.cars__list') as HTMLElement;
  const carNameInput = document.querySelector('.garage__car-name-create') as HTMLInputElement;
  const carColorInput = document.querySelector('.garage__car-color-create') as HTMLInputElement;

  const car = await createCar({ name: carNameInput.value, color: carColorInput.value });
  const { name, color, id } = car;
  const carTemplate = createCarTemplate({ name, color, id });

  carNameInput.value = '';
  carColorInput.value = '#000000';
  carsList.insertAdjacentHTML('beforeend', carTemplate);
  await setGarageCarsAmount();
}

async function removeCarFromCarsList(event: Event) {
  const carToRemove = (event.target as HTMLElement).closest('.cars__item') as HTMLLIElement;
  const carId = +(carToRemove.dataset.carId as string);

  await deleteCar(carId);
  await setGarageCarsAmount();
  carToRemove.remove();
}

async function activateCarUpdatingElements(event: Event) {
  const carNameInput = document.querySelector('.garage__car-name-update') as HTMLInputElement;
  const carColorInput = document.querySelector('.garage__car-color-update') as HTMLInputElement;
  const carUpdateButton = document.querySelector('.garage__submit-update') as HTMLInputElement;

  carNameInput.disabled = false;
  carColorInput.disabled = false;
  carUpdateButton.disabled = false;

  const carElement = (event.target as HTMLButtonElement).closest('.cars__item') as HTMLLIElement;
  const carId = carElement.dataset.carId as string;
  const carData = await getCar(+carId) as CarFullData;

  carNameInput.value = carData.name;
  carColorInput.value = carData.color;
  carUpdateButton.dataset.carId = carId;
}

function deactivateCarUpdatingElements() {
  const carNameInput = document.querySelector('.garage__car-name-update') as HTMLInputElement;
  const carColorInput = document.querySelector('.garage__car-color-update') as HTMLInputElement;
  const carUpdateButton = document.querySelector('.garage__submit-update') as HTMLInputElement;

  carNameInput.disabled = true;
  carColorInput.disabled = true;
  carUpdateButton.disabled = true;
  carNameInput.value = '';
  carColorInput.value = '#000000';
}

async function updateCarInCarsList() {
  const carNameInput = document.querySelector('.garage__car-name-update') as HTMLInputElement;
  const carColorInput = document.querySelector('.garage__car-color-update') as HTMLInputElement;
  const carUpdateButton = document.querySelector('.garage__submit-update') as HTMLInputElement;

  const carId = carUpdateButton.dataset.carId as string;
  const carData = await updateCar(+carId, { name: carNameInput.value, color: carColorInput.value });

  const carToUpdateElement = document.querySelector(`.cars__item[data-car-id="${carId}"]`) as HTMLLIElement;
  const carNameToUpdate = carToUpdateElement.querySelector('.cars__car-name') as HTMLElement;
  const carColorToUpdate = carToUpdateElement.querySelector('.car__color') as HTMLElement;

  carNameToUpdate.textContent = carData.name;
  carColorToUpdate.style.fill = carData.color;
}

async function getCarsPagesAmount(): Promise<number> {
  const cars = await getCars();
  return Math.ceil(cars.length / CARS_AMOUNT_PER_PAGE);
}

async function renderCurrentCarsPage() {
  const carsList = document.querySelector('.cars__list') as HTMLElement;
  const cars = await getCars({
    [QueryKeys.LIMIT]: CARS_AMOUNT_PER_PAGE,
    [QueryKeys.PAGE]: currentCarsPage.page,
  });

  carsList.innerHTML = cars
    .map((car) => {
      const { name, color, id } = car;
      return createCarTemplate({ name, color, id });
    })
    .reduce((template, car) => template + car, '');

  const resetButton = document.querySelector('.garage__reset') as HTMLButtonElement;
  const raceButton = resetButton.previousElementSibling as HTMLButtonElement;

  resetButton.disabled = true;
  raceButton.disabled = false;
}

async function changeCartPageButtonsState() {
  const estimatedPages = await getCarsPagesAmount();
  const prevButton = document.querySelector('.cars__prev') as HTMLButtonElement;
  const nextButton = document.querySelector('.cars__next') as HTMLButtonElement;

  nextButton.disabled = currentCarsPage.page === estimatedPages;
  prevButton.disabled = currentCarsPage.page <= 1;
}

async function changeCarsPage(event: Event) {
  const estimatedPages = await getCarsPagesAmount();
  const button = event.target as HTMLButtonElement;
  const pageContainer = document.querySelector('.cars__page') as HTMLElement;
  const allPagesContainer = document.querySelector('.cars__page-all') as HTMLElement;

  if (button.classList.contains('cars__next')) {
    if (!button.disabled) {
      currentCarsPage.page += 1;
    }
  } else if (button.classList.contains('cars__prev')) {
    if (!button.disabled) {
      currentCarsPage.page -= 1;
    }
  } else if (button.classList.contains('cars__remove')) {
    const cars = await getCars({
      [QueryKeys.LIMIT]: CARS_AMOUNT_PER_PAGE,
      [QueryKeys.PAGE]: currentCarsPage.page,
    });
    const isLastCarOnPage = cars.length === 0;

    if (isLastCarOnPage && currentCarsPage.page >= 1) {
      currentCarsPage.page -= 1;
      await renderCurrentCarsPage();
    }
  } else if ((button.classList.contains('garage__submit-create')
    || button.classList.contains('garage__generate')) && currentCarsPage.page === 0) {
    currentCarsPage.page += 1;
  }

  await changeCartPageButtonsState();
  pageContainer.textContent = currentCarsPage.page.toString();
  allPagesContainer.textContent = estimatedPages.toString();
}

function listenCarManageEvents() {
  document.addEventListener('click', async (event: Event) => {
    const target = event.target as HTMLElement;

    if (target.matches('.garage__submit-create')) {
      await activatePreloaderOnElement(event.target as HTMLButtonElement);
      await appendCarToCarsList();
      await changeCarsPage(event);
      await renderCurrentCarsPage();
      await deactivatePreloaderOnElement(event.target as HTMLButtonElement);
    }

    if (target.matches('.cars__remove')) {
      await activatePreloaderOnElement(event.target as HTMLButtonElement);
      await changeCarsPage(event);
      await removeCarFromCarsList(event);
      await renderCurrentCarsPage();
      await changeCarsPage(event);
      await deactivatePreloaderOnElement(event.target as HTMLButtonElement);
    }

    if (target.matches('.cars__select')) {
      activateCarUpdatingElements(event);
    }

    if (target.matches('.garage__submit-update')) {
      await updateCarInCarsList();
      deactivateCarUpdatingElements();
    }

    if (target.matches('.cars__next') || target.matches('.cars__prev')) {
      await changeCarsPage(event);
      await renderCurrentCarsPage();
    }

    if (target.matches('.garage__generate')) {
      await activatePreloaderOnElement(event.target as HTMLButtonElement);
      await createOneHundredRandomCars();
      await changeCarsPage(event);
      await renderCurrentCarsPage();
      await setGarageCarsAmount();
      await deactivatePreloaderOnElement(event.target as HTMLButtonElement);
    }
  });
}

export {
  createCarsInitContainer,
  listenCarManageEvents,
  getCarsPagesAmount,
};
