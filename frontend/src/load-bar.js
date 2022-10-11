/**
 * Small utils that create a load bar on when user is about to leave page.
 *
 * Fist 400ms nothing happens and then a load bar is displayed that last around 5 seconds
 *
 * Load bar is entirely a visual trick to help with user patience.
 */

const wait = async (timeout) => {
  return new Promise((resolve, reject) =>
    window.setTimeout(() => resolve(), timeout)
  );
};

/**
 * Load bar position from 0 to 100%
 * first two 0 = wait 200ms before triggering load bar
 *  */
const positions = [
  0, 0, 3, 5, 10, 12, 15, 22, 28, 34, 35, 36, 38, 40, 45, 65, 66, 67, 67, 68,
  70, 73, 75, 77, 78, 80, 82, 83, 85, 86, 88, 88, 89, 90, 91, 92, 94, 94, 95,
  96, 96, 97,
];

(function init() {
  window.addEventListener('beforeunload', async (e) => {
    const loader = document.createElement('div');
    loader.style.position = 'fixed';
    loader.style.transition = 'width 150ms ease-in-out';
    loader.style.top = '0';
    loader.style.left = '0';
    loader.style.background = '#000091';
    loader.style.width = '0';
    loader.style.height = '3px';
    loader.style.zIndex = '00';

    document.body.appendChild(loader);
    for (let w of positions) {
      loader.style.width = `${w}vw`;
      await wait(200);
    }
  });
})();
