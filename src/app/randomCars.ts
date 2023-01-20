import { createCar } from '../api/garage';
import createCarTemplate from '../components/carTemplate';
import { getRandomCarName, getRandomColor } from '../utils/utils';

async function createOneHundredRandomCars() {
  const carsList = document.querySelector('.cars__list') as HTMLElement;
  const cars = [];

  for (let i = 0; i < 100; i += 1) {
    const carRandomName = getRandomCarName();
    const carRandomColor = getRandomColor();

    cars.push([carRandomName, carRandomColor]);
  }

  let carsTemplates = '';

  cars.forEach(async (randomCar) => {
    const [randomName, randomColor] = randomCar;
    const car = await createCar({ name: randomName, color: randomColor });
    const { name, color, id } = car;
    const carTemplate = createCarTemplate({ name, color, id });

    carsTemplates += carTemplate;
  });

  carsList.insertAdjacentHTML('beforeend', carsTemplates);
}

export default createOneHundredRandomCars;
