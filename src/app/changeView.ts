const changePageView = (selectorToHide: string, selectorToShow: string, pageTitle: string) => {
  const sectionToHide = document.querySelector(selectorToHide) as HTMLElement;
  const sectionToShow = document.querySelector(selectorToShow) as HTMLElement;
  const title = document.querySelector('.page-title') as HTMLHeadingElement;

  sectionToHide.classList.add('hidden');
  sectionToShow.classList.remove('hidden');
  title.textContent = pageTitle;
};

function listenChangePageView() {
  const header = document.querySelector('.header') as HTMLElement;

  header.addEventListener('click', (event: Event) => {
    const garagePageButton = '.button-garage';
    const winnersPageButton = '.button-winners';
    const target = event.target as HTMLButtonElement;

    if (target.matches(garagePageButton)) {
      changePageView('.winners', '.garage', 'Garage');
    }

    if (target.matches(winnersPageButton)) {
      changePageView('.garage', '.winners', 'Winners');
    }
  });
}

export default listenChangePageView;
