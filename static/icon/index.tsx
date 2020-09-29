import React from 'react';

const download = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const pin = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
      fill="currentColor"
    />
    <circle cx="12" cy="10" r="3" fill="white" stroke="white" strokeWidth="2" />
  </svg>
);

const map = (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M68.5 29.5V48H87V29.5H68.5z" fill="#C3E095" />
    <path
      d="M0 154.5v-102h19.5v78.3L0 154.5zM0 165v15h71v-44H23.6L0 165zM95.5 136v44h22v-44h-22zM180 180v-44h-59v44h59zM95.5 85.5v43h22V91.4l-22-5.9zM180 128.5V108l-59-15.7v36.2h59zM95.5 29.5v45l22 5.5V29.5h-22zM155 23h25V0h-25v23zM147 0v23h-14V0h14zM95.5 23V0h34v23h-34zM87.5 0v23h-14V0h14zM61 23L37 0h34v23H61zM0 0h31l13.7 13.5-25.2 34H0V0zM61 29.5v18H25l22.8-31 13.2 13zM121 80.8V29.5h40.5v61.4l-40.5-10zM164.5 91.6l15.5 3.9v-66h-15.5v62.1zM25 124.1V52.5h46v15.8L25 124zM87.5 128.5v-71l-14 17.2v53.8h14zM87.5 180v-44h-14v44h14zM73.5 52.5H84L73.5 65.3V52.5zM71 128.5H29.7L71 77.8v50.7z"
      fill="#DFDFF1"
    />
  </svg>
);

export { download, map, pin };
