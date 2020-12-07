import React from 'react';
import SearchBar from '../searchBar';

const HeaderSmall = ({ currentSearchTerm = '', map = false }) => (
  <>
    <div className="header-small">
      <div className="content-container">
        <a href="/">
          <svg
            width="47"
            height="47"
            viewBox="0 0 47 47"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="a"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="47"
              height="47"
            >
              <circle cx="23.5" cy="23.5" r="23.5" fill="#fff" />
            </mask>
            <g mask="url(#a)">
              <path
                d="M8.4 39.8a63.3 63.3 0 004-4.2l.9-.7.1-.4-1 .7s-.2-.1 0-.2l.8-.6c-.2 0-.2-.1-.2-.2-1-.1-1.8.6-2.5 1.2-.2.1-.4 0-.4 0-1.2.4-2.1 1.4-3.3 1.9V37l-1.5.6h-2l-3 .6-1.5.6-.2.1a2 2 0 01-.5.6l-1.4 1h-.1L-4.7 42h-.2l.2-.4.2-.4.4-.5-.1-.1c.4-.4.8-.8 1.3-1 0 0-.1 0 0-.1V39h.1c-.2 0-.3 0-.4.2-.2.2-.4.5-.7.5h-.2v-.1h.1v-.2l.1-.1.1-.2.2-.2v-.2c0-.2.2-.3.5-.5l.9-.5h.1a5.4 5.4 0 00-1.4.6.2.2 0 01-.2 0v-.1c0-.2.3-.2.5-.4h.2c2.5-2 6-1.5 9-2.5l.8-.5c.4-.2.7-.6 1.2-.8.6-.5 1.1-1.1 1.3-1.9v-.1c-1 1-2.3 2-3.6 2.6-1.7 1-3.5.7-5.3 1 0-.2.2-.2.4-.2 0-.2.2-.3.3-.5h.3l.1-.1.3-.1c-.2-.3-.7.2-1 0 0-.2 0-.4.2-.5h.3l.1-.3L5 32c-.2 0-.4.3-.6.1l.1-.2 2.5-1c-.3 0-.5.2-.9 0 .2-.1.3-.3.5-.3v-.2l.2-.1-.2-.1c.1-.2.4 0 .5-.3h-.2c.3-.3.7-.5 1-.5 0-.2-.3 0-.3-.2h.2-.2c-.1-.1 0-.3 0-.4.5-.5.5-1.3.7-2H8c-.8.9-2 1.2-3.3 1.5h-.4a1.7 1.7 0 01-1.4 0l-.8-.7c-.6-.4-1.3-.8-2-1-2-.7-4.1-1-6.2-.9.9-.5 1.8-.5 2.8-.8 1.4-.4 2.6-.9 4-.8H0c-1.1 0-2.3.2-3.5.5-.8.2-1.5.5-2.3.6-.5.2-.7.7-1.3.6v-.2c.8-1 1.8-2 3-2 1.5-.3 2.9 0 4.3 0l3 .7c.5 0 .6.6.9.7.5.1 1 0 1.4.3v-.5c.3-.3.7.1 1 0 .7-.5-.5-1.2-.8-1.8V23c.7.5 1.2 1.2 2 1.6.4.2 1.3.4 1.2 0-.4-1-1.2-1.7-1.9-2.5v-.3l-.2-.2v-.3c-.3-.2-.2-.5-.4-.7-.2-.5 0-1-.2-1.5l-.4-1.4-.7-3.9c-.1-1.5 1-2.7 1.6-4A7 7 0 019 7c.3-1 3.5-4 6-5s5-2 8-2l-63-6.5v51.3L-6.7 50c1.5-1.1 8.8-6.8 11-7.9 1-.5 3.3-1.6 4-2.3zM-4 34c-.1 0-.5 0-.4-.1 0-.4.7-.4 1-.6l.5-.2c.2.3.4.2.6.4-.5.5-1.1.2-1.7.5zm-12.3-1.8V32c1-1.3 1.8-2.7 2.5-4.1 1-.6 2-1.4 2.7-2.3 1.3-1.4 2.8-2.6 4.5-3.5.7-.3 1.4-.2 2.1 0-.2.4-.6.3-1 .5a.3.3 0 01-.2 0 .3.3 0 000-.3c-.7 1-1.9 1.3-2.5 2.4-.5.8-.8 1.8-1.8 2-.4.1 0-.2-.1-.1a27 27 0 00-6.2 5.6zm6.7-5.4l-.3.4-.3.3-.2-.1a1 1 0 01.7-.7v.1zM-6 39l-.2.2c.1 0 .2 0 .1.1l-.6.4h-.1l-.3.3c-.1.1-.6 0-.4 0l.6-.6.3-.4.2-.1s.5-.1.4 0zm-1.4-.7a11 11 0 01-2 1.1.1.1 0 00-.2 0 3.7 3.7 0 00-.9.7v.1l-.3.2v.1h-.4l-.1.1h-.1a4.4 4.4 0 00-.8.8v.1h-.1l-.1-.2.2-.3v-.1l.1-.1.3-.4.1-.2.1-.2.1-.2v-.2-.1l.4-.5-.4.3s-.2 0-.1-.1l.2-.2a4.5 4.5 0 01.6-.6l.2-.2c.8-.8 2-.7 3.1-1.2.4-.2.9 0 1.3 0l.7.1-2 1.2zm1.6-5.6c0-.1.2 0 .3-.2H-6l-.1-.2-1.3.4-1.7.7c-.9.3-1.6 1-2.5 1.4l-.1-.2c0-.2.4-.3.5-.6V34c.6-.9 1.5-1.4 2.3-2.1v-.3c.2-.3.6-.4.8-.9.2-.3.4-.5.8-.7 0 0-.2 0-.2-.2-.4 0-.7.1-1-.1l.5-.3-.2-.1c0-.2.2-.3.4-.4.3 0 .7 0 1-.3-.6-.1-1.2.1-1.8-.2.4-1 1-1.9 2-2.4h.3a.8.8 0 01-.7.9 8 8 0 012 .5h-.3c.4.3.8.1 1.2.4-.2.3-.5 0-.7 0 2.5.8 5.2 1.3 7.2 3-1.7.8-3.6 1.3-5.5 1.6h-.6l-.1.2c-.3 0-.6 0-.8.2a1 1 0 01-1 0z"
                fill="#000091"
              />
              <path
                d="M74-10L24.5 0c.2 0 2.5 0 7.1 2.2l1.2.6c.6.3 1.1.8 1.5 1.3.2.3.4.7.3 1-.2.5-.3 1.1-.7 1.3a3 3 0 01-1.7.1 4 4 0 01-1-.1c1.3.5 2.4 1 3.2 2.2l.7.2.1.2c-.2.2-.3.3-.2.5h.2c.4-.1.3-1 .9-.7a1 1 0 01.3 1.2l-1 .8a.7.7 0 000 .6c.2.3.4.6.4 1 .3.5.4 1.2.6 1.7.4 1.2.6 2.4.6 3.7 0 .6-.4 1.2-.1 1.8.2.6.5 1.2.9 1.7l.9 1.3c.4.8 1.3 1.6 1 2.6-.3.6-1.2.5-1.8.8-.4.4 0 1 .2 1.5.4.7-.5 1.2-1 1.4.1.3.5.2.5.4 0 .4.5.6.3 1-.4.5-1.3.7-.9 1.5.4.5.2 1.2 0 1.8a2 2 0 01-1.5 1.2H34l-.5-.1c-1.4-.2-2.7-.6-4.1-.6-.4 0-.8.2-1.1.3l-1 1-.2.1v.1l-.1.1-.7 1v.1l-.7 1.5c-.5 1.9-.3 3.4 0 3.8l4.5 1.7c.7.3 7.4 3.3 8 3.7l20.4 10L74-10z"
                fill="#E1000F"
              />
              <path
                d="M34 17.6c.3 0 .7 0 .7.3-.1.6-1 .8-1.6 1.4H33c-.3.2-.2.6-.4.6h-.7a1.4 1.4 0 001.2.6.4.4 0 01.2.3H33.5v.3c-.2.3-.6.2-1 .3h2c.4-.2 0-1 .2-1.4l-.1-.3.5-.5a.6.6 0 00.4-.2c0-.2-.3-.3-.2-.4.5-.3.9-.8.7-1.3 0-.2-.7-.2-1.1-.4h-1.4a6.5 6.5 0 00-2.7 1.2l1.8-.5h1.3z"
                fill="#9D9D9C"
              />
            </g>
          </svg>
        </a>
        <SearchBar
          defaultValue={currentSearchTerm}
          url={map ? '/rechercher/carte' : '/rechercher'}
        />
        <div className="about">
          <a href="/comment-ca-marche">
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
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Comment ça marche&nbsp;?</span>
          </a>
        </div>
      </div>
    </div>
    <style global jsx>{`
      .header-small {
        border-bottom: 1px solid #00009166;
        display: flex;
        align-items: center;
        position: sticky;
        top: 0;
        background-color: #fff;
        z-index: 10;
        height: 70px;
      }
      .header-small > div {
        display: flex;
      }
      .header-small svg {
        width: auto;
        height: 42px;
        object-fit: cover;
        margin: 12px 10px;
        margin-left: 0;
        display: block;
      }

      .about {
        flex-grow: 1;
      }

      .about > a {
        height: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        text-align: center;
      }
      .about > a > svg {
        color: #000091;
        display: block;
        margin: 0;
        height: 24px;
        margin: 12px 10px;
      }

      @media only screen and (min-width: 1px) and (max-width: 900px) {
        .about {
          margin-left: 10px;
        }
        .about > a > span {
          display: none;
        }
      }
      @media only screen and (min-width: 1px) and (max-width: 600px) {
        .header-small > div.content-container > a,
        .about {
          display: none;
        }
      }
    `}</style>
  </>
);

const Header = () => (
  <>
    <div className="header">
      <img height={110} src="/images/logo_RF.svg" alt="" />
      <div className="about">
        <a href="/comment-ca-marche">
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
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>Comment ça marche&nbsp;?</span>
        </a>
      </div>
    </div>

    <style global jsx>{`
      .header {
        height: 150px;
        display: flex;
        justify-content: space-between;
      }
      .header img {
        margin: 20px;
      }

      .about > a {
        flex-grow: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        text-align: center;
        margin: 20px;
      }
      .about > a > svg {
        color: #000091;
        display: block;
        margin: 0;
        height: 24px;
        margin: 12px 10px;
        flex-shrink: 0;
      }
      .about > a > span {
        text-align: left;
      }
      @media only screen and (min-width: 1px) and (max-width: 600px) {
        .header .about > a > svg {
          display: none;
        }
        .about > a > span {
          text-align: right;
        }
      }
    `}</style>
  </>
);

export { Header, HeaderSmall };
