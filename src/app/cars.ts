import {
  getCars,
  createCar,
  deleteCar,
  getCar,
  updateCar,
} from '../api/garage';
import createCarTemplate from '../components/carTemplate';
import { CARS_AMOUNT_PER_PAGE } from '../utils/constants';
import { QueryKeys } from '../utils/enums';
import { CarFullData } from '../utils/types';
import {
  activateProloaderOnElement,
  deactivateProloaderOnElement,
  getRandomCarName,
  getRandomColor,
} from '../utils/utils';

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
  let carsContainer: string = '';

  cars.forEach((car) => {
    carsContainer += createCarTemplate({
      name: car.name,
      color: car.color,
      id: car.id,
    });
  });

  return carsContainer;
}

async function appendCarToCarsList() {
  const carsList = document.querySelector('.cars__list') as HTMLElement;
  const carName = document.querySelector('.garage__car-name-create') as HTMLInputElement;
  const carColor = document.querySelector('.garage__car-color-create') as HTMLInputElement;

  const car = await createCar({
    name: carName.value,
    color: carColor.value,
  });

  const carTemplate = createCarTemplate({
    name: car.name,
    color: car.color,
    id: car.id,
  });

  await setGarageCarsAmount();
  carsList.insertAdjacentHTML('beforeend', carTemplate);

  carName.value = '';
  carColor.value = '#000000';
}

async function removeCarFromCarsList(event: Event) {
  const carToRemove = (event.target as HTMLElement).closest('.cars__item') as HTMLLIElement;
  const carId = +(carToRemove.dataset.carId as string);
  const response = await deleteCar(carId);

  if (response.ok) {
    await setGarageCarsAmount();
    carToRemove.remove();
  } else {
    throw new Error('Not found');
  }
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
  const carData = await updateCar(+carId, {
    name: carNameInput.value,
    color: carColorInput.value,
  });

  const carToUpdateElement = document.querySelector(`.cars__item[data-car-id="${carId}"]`) as HTMLLIElement;
  const carNameToUpdate = carToUpdateElement.querySelector('.cars__car-name') as HTMLElement;
  const carColorToUpdate = carToUpdateElement.querySelector('.car__color') as HTMLElement;

  carNameToUpdate.textContent = carData.name;
  carColorToUpdate.style.fill = carData.color;
}

async function getCarsPagesAmount(): Promise<number> {
  const cars = await getCars();
  const estimatedPages = Math.ceil(cars.length / CARS_AMOUNT_PER_PAGE);

  return estimatedPages;
}

let currentCarsPage = 1;

async function renderCurrentCarsPage() {
  const carsList = document.querySelector('.cars__list') as HTMLElement;
  const cars = await getCars({
    [QueryKeys.LIMIT]: CARS_AMOUNT_PER_PAGE,
    [QueryKeys.PAGE]: currentCarsPage,
  });

  let newCarsList: string = '';

  cars.forEach((car) => {
    newCarsList += createCarTemplate({
      name: car.name,
      color: car.color,
      id: car.id,
    });
  });

  carsList.innerHTML = newCarsList;
}

async function changeCartPageButtonsState() {
  const estimatedPages = await getCarsPagesAmount();
  const prevButton = document.querySelector('.cars__prev') as HTMLButtonElement;
  const nextButton = document.querySelector('.cars__next') as HTMLButtonElement;

  if (currentCarsPage === estimatedPages) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
  }

  if (currentCarsPage <= 1) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }
}

async function changeCarsPage(event: Event) {
  const estimatedPages = await getCarsPagesAmount();
  const button = event.target as HTMLButtonElement;
  const pageContainer = document.querySelector('.cars__page') as HTMLElement;
  const allPagesContainer = document.querySelector('.cars__page-all') as HTMLElement;

  if (button.classList.contains('cars__next')) {
    if (!button.disabled) {
      currentCarsPage += 1;
    }
  } else if (button.classList.contains('cars__prev')) {
    if (!button.disabled) {
      currentCarsPage -= 1;
    }
  } else if (button.classList.contains('cars__remove')) {
    const cars = await getCars({
      [QueryKeys.LIMIT]: CARS_AMOUNT_PER_PAGE,
      [QueryKeys.PAGE]: currentCarsPage,
    });
    const isLastCarOnPage = cars.length === 0;

    if (isLastCarOnPage && currentCarsPage >= 1) {
      currentCarsPage -= 1;
      await renderCurrentCarsPage();
    }
  } else if ((button.classList.contains('garage__submit-create')
    || button.classList.contains('garage__generate')) && currentCarsPage === 0) {
    currentCarsPage += 1;
  }

  await changeCartPageButtonsState();
  pageContainer.textContent = currentCarsPage.toString();
  allPagesContainer.textContent = estimatedPages.toString();
}

async function createOneHundredRandomCars() {
  const carsList = document.querySelector('.cars__list') as HTMLElement;
  const cars = [];

  for (let i = 0; i < 100; i += 1) {
    const carName = getRandomCarName();
    const carColor = getRandomColor();

    cars.push([carName, carColor]);
  }

  let carsTemplates = '';

  cars.forEach(async (car) => {
    const [carName, carColor] = car;
    const carData = await createCar({
      name: carName,
      color: carColor,
    });

    const carTemplate = createCarTemplate({
      name: carData.name,
      color: carData.color,
      id: carData.id,
    });

    carsTemplates += carTemplate;
  });

  carsList.insertAdjacentHTML('beforeend', carsTemplates);
}

function listenCarManageEvents() {
  document.addEventListener('click', async (event: Event) => {
    const target = event.target as HTMLElement;

    if (target.matches('.garage__submit-create')) {
      await activateProloaderOnElement(event.target as HTMLButtonElement);
      await appendCarToCarsList();
      await changeCarsPage(event);
      await renderCurrentCarsPage();
      await deactivateProloaderOnElement(event.target as HTMLButtonElement);
    }

    if (target.matches('.cars__remove')) {
      await activateProloaderOnElement(event.target as HTMLButtonElement);
      await changeCarsPage(event);
      await removeCarFromCarsList(event);
      await renderCurrentCarsPage();
      await changeCarsPage(event);
      await deactivateProloaderOnElement(event.target as HTMLButtonElement);
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
      await activateProloaderOnElement(event.target as HTMLButtonElement);
      await createOneHundredRandomCars();
      await changeCarsPage(event);
      await renderCurrentCarsPage();
      await setGarageCarsAmount();
      await deactivateProloaderOnElement(event.target as HTMLButtonElement);
    }
  });
}

export { createCarsInitContainer, listenCarManageEvents, getCarsPagesAmount };
