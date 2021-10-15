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

const copy = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

const copied = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const information = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" fill="currentColor"></circle>
    <line x1="12" y1="16" x2="12" y2="12" stroke="#fff"></line>
    <line x1="12" y1="8" x2="12.01" y2="8" stroke="#fff"></line>
  </svg>
);

const facebook = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const linkedin = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const twitter = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const qrCode = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="currentColor"
    stroke="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.36364 11.6364V13.0909H2.90909V11.6364H4.36364ZM4.36364 2.90909V4.36364H2.90909V2.90909H4.36364ZM13.0909 2.90909V4.36364H11.6364V2.90909H13.0909ZM1.45455 14.5341H5.81818V10.1818H1.45455V14.5341ZM1.45455 5.81818H5.81818V1.45455H1.45455V5.81818ZM10.1818 5.81818H14.5455V1.45455H10.1818V5.81818ZM7.27273 8.72727V16H0V8.72727H7.27273ZM13.0909 14.5455V16H11.6364V14.5455H13.0909ZM16 14.5455V16H14.5455V14.5455H16ZM16 8.72727V13.0909H11.6364V11.6364H10.1818V16H8.72727V8.72727H13.0909V10.1818H14.5455V8.72727H16ZM7.27273 0V7.27273H0V0H7.27273ZM16 0V7.27273H8.72727V0H16Z" />
  </svg>
);

const print = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

export {
  download,
  map,
  pin,
  copy,
  copied,
  information,
  facebook,
  linkedin,
  twitter,
  qrCode,
  print,
};
