function createWinnerTemplate(name: string, seconds: string) {
  const template = `
    <div class="overlay">
      <div class="winner">
        <p class="winner__message">${name} finished first in ${seconds} seconds</p>
      </div>
    </div>
  `;

  return template;
}

export default createWinnerTemplate;
