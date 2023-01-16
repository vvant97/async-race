import { getCars } from '../api/garage';
import { getWinners } from '../api/winners';
import { createCarsInitContainer, getCarsPagesAmount } from '../app/cars';
import { PageTemplate } from '../utils/types';

function createPageTemplate(template: PageTemplate) {
  const pageTemplate = `
    <div class="root">
      <div class="container">
        <h1 class="page-title">Garage</h1>
        <header class="header">
          <button class="button button-garage">Garage</button>
          <button class="button button-winners">Winners</button>
        </header>

        <main class="main">
          <section class="garage">
            <div class="garage__container">
              <div class="garage__create">
                <input class="garage__car-name garage__car-name-create" type="text" />
                <input class="garage__car-color garage__car-color-create" type="color" />
                <button class="button garage__submit-create">Create car</button>
              </div>
              <div class="garage__update">
                <input class="garage__car-name garage__car-name-update" type="text" disabled />
                <input class="garage__car-color garage__car-color-update" type="color" disabled />
                <button class="button garage__submit-update" disabled>Update car</button>
              </div>
              <div class="garage__cars-controls">
                <button class="button garage__race" >Race</button>
                <button class="button garage__reset" >Reset</button>
                <button class="button garage__generate" >Generate cars</button>
              </div>
            </div>

            <div class="cars">
              <h2 class="cars__title">Garage: <span class="cars__amount">${template.carsAmount}</span> cars</h2>
              <h3 class="cars__subtitle">Page: <span class="cars__page">1</span> / <span class="cars__page-all">${template.estimatedCarsPages > 1 ? template.estimatedCarsPages : '1'}</span></h3>
              <ul class="cars__list">${template.carsList}</ul>
              <div class="cars__page-controls">
                <button class="button cars__prev" disabled>Prev</button>
                <button class="button cars__next" ${template.estimatedCarsPages > 1 ? '' : 'disabled'}>Next</button>
              </div>
            </div>
          </section>

          <section class="winners hidden">
            <h2 class="winners__title">Winners: <span class="winners__amount">${template.winnersAmount}</span> cars</h2>
            <h3 class="winners__subtitle">Page #<span class="winners__page">1</span></h3>
            <table class="winners__table">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Car</th>
                  <th>Name</th>
                  <th>Wins</th>
                  <th>Best time, s</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
            <div class="winners__page-controls">
              <button class="button winners__prev" disabled>Prev</button>
              <button class="button winners__next" disabled>Next</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  `;

  return pageTemplate;
}

async function renderPage() {
  const cars = await getCars();
  const winners = await getWinners();
  const carsContainer = await createCarsInitContainer();
  const carsPages = await getCarsPagesAmount();
  const pageTemplate = createPageTemplate({
    carsAmount: cars.length,
    winnersAmount: winners.length,
    carsList: carsContainer,
    estimatedCarsPages: carsPages,
  });

  document.body.innerHTML = pageTemplate;
}

export default renderPage;
