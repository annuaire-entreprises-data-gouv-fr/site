const wait = async (timeout) => {
  return new Promise((resolve, reject) =>
    window.setTimeout(() => resolve(), timeout)
  );
};

window.addEventListener('beforeunload', async () => {
  const loader = document.createElement('div');
  loader.style.position = 'absolute';
  loader.style.transition = 'width 150ms ease-in-out';
  loader.style.top = '0';
  loader.style.left = '0';
  loader.style.background = '#000091';
  loader.style.width = '30vw';
  loader.style.height = '4px';
  loader.style.zIndex = 1000;

  document.body.appendChild(loader);

  for (let w of [
    0, 3, 5, 10, 12, 15, 22, 28, 34, 35, 36, 38, 40, 45, 65, 66, 78, 80, 85, 88,
    89, 90, 91, 92, 95,
  ]) {
    loader.style.width = `${w}vw`;
    await wait(200);
  }
});
