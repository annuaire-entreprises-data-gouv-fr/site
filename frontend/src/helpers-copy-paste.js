/**
 * COPY TO CLIPBOARD FUNCTION
 */

const copyIcon = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="15"
  height="15"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  >
  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
</svg>`;

const copiedIcon = `<svg 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"  
  viewBox="0 0 30 30" 
  width="15" 
  stroke="currentColor"
  fill="none"  
  stroke-linecap="round" 
  stroke-linejoin="round" 
  stroke-miterlimit="10" 
  stroke-width="2"
  height="15px">
    <path  d="M4 16L11 23 27 7"/>
  </svg>`;

const htmlCopyButton = `${copyIcon}&nbsp;copier`;
const htmlCopiedButton = `${copiedIcon}&nbsp;copié!`;

function logCopyPaste(element) {
  try {
    const label = element.closest('tr').childNodes[0].innerText;
    var _paq = window._paq || [];
    _paq.push(['trackEvent', 'action', 'copyPaste', `${label}`]);
  } catch {}
}

function createCopyButton(element) {
  const widthFallback = document.createElement('div');
  widthFallback.style.width = '87px';
  element.append(widthFallback);

  element.style.display = 'flex';
  element.style.alignItems = 'center';
  element.style.cursor = 'pointer';

  const copyWrapper = document.createElement('div');
  copyWrapper.style.cursor = 'pointer';
  copyWrapper.style.display = 'flex';
  copyWrapper.style.alignItems = 'center';
  copyWrapper.style.justifyContent = 'start';
  copyWrapper.style.position = 'relative';

  let copyLabel;
  let copyButton;
  element.addEventListener(
    'mouseenter',
    (event) => {
      widthFallback.remove();
      copyLabel = document.createElement('span');
      copyLabel.style.position = 'relative';
      copyLabel.style.borderRadius = '3px';
      copyLabel.style.padding = '0 3px';
      copyLabel.style.width = '75px';
      copyLabel.style.flexShrink = 0;
      copyLabel.style.color = '#000091';
      copyLabel.style.marginLeft = '12px';
      copyLabel.style.backgroundColor = '#dfdff1';
      copyLabel.style.fontSize = '0.9rem';

      copyButton = document.createElement('span');
      copyButton.style.display = 'flex';
      copyButton.style.alignItems = 'center';
      copyButton.innerHTML += htmlCopyButton;

      copyWrapper.append(copyLabel);
      copyLabel.append(copyButton);
      element.append(copyWrapper);
    },
    false
  );
  element.addEventListener('mouseleave', (event) => {
    element.append(widthFallback);
    copyWrapper.remove();
    copyLabel.remove();
  });

  element.onclick = () => {
    copyLabel.style.color = 'green';
    copyButton.innerHTML = htmlCopiedButton;
    setTimeout(() => {
      copyButton.innerHTML = htmlCopyButton;
      copyLabel.style.color = '#000091';
    }, 600);
    const el = document.createElement('textarea');
    let toCopy = element.children[0].innerHTML;
    if (element.className.indexOf('trim') > -1) {
      toCopy = toCopy.split(' ').join('');
    }
    el.value = toCopy;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    logCopyPaste(element);
  };
}

(function addAllCopyFunctions() {
  const copyList = document.getElementsByClassName('copy-button');
  for (var i = 0; i < copyList.length; i++) {
    const element = copyList[i];
    createCopyButton(element);
  }
})();
