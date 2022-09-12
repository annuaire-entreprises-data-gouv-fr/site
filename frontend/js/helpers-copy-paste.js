/**
 * COPY TO CLIPBOARD FUNCTION
 */

export function addCopyFunction(element) {
  element.onclick = () => {
    element.classList.toggle('copy-done');
    var el = document.createElement('textarea');

    var toCopy = element.children[0].innerHTML;
    if (element.className.indexOf('trim') > -1) {
      toCopy = toCopy.split(' ').join('');
    }

    el.value = toCopy;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    window.setTimeout(function () {
      element.classList.toggle('copy-done');
    }, 800);
  };
}

(function addAllCopyFunctions() {
  const copyList = document.getElementsByClassName('copy-to-clipboard-anchor');
  for (var i = 0; i < copyList.length; i++) {
    const element = copyList[i];
    addCopyFunction(element);
  }
})();
