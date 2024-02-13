'use client';

export const diamond = (
  <svg
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 53 61"
    width="100"
    height="100"
  >
    <path
      d="m26.5 0 26.4 15.3v30.4L26.5 61 .1 45.7V15.3L26.5 0Z"
      fill="currentColor"
    />
  </svg>
);
/**
 * Render website's logo using a mix of SVG and text, SEO good practises
 *
 * @returns
 */
export const HomeH1 = () => (
  <div className="home-h1">
    <span>{diamond}</span>
    <h1>
      L’<strong>Annuaire</strong> des
      <br />
      <strong>Entreprises</strong>
    </h1>
    <style jsx>
      {`
        .home-h1 {
          width: 260px;
          height: 100px;
          max-width: 90%;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .home-h1 > span {
          position: absolute;
          z-index: 0;
          left: 0;
          top: 0;
          color: #e8edff;
        }
        .home-h1 > h1 {
          position: absolute;
          z-index: 1;
          font-weight: 100;
          font-size: 2rem;
          line-height: 2rem;
          top: 20px;
          left: 25px;
          padding: 0;
          margin: 0;
        }

        .home-h1 > h1 > strong {
          font-weight: 900;
        }
        .home-h1 > h1 > b:nth-of-type(2) {
          margin-left: 25px;
        }

        @media only screen and (min-width: 1px) and (max-width: 576px) {
          .home-h1 {
            width: 210px;
            height: 90px;
          }
          .home-h1 > svg {
            height: 90px;
          }
          .home-h1 > h1 {
            font-size: 1.5rem;
            line-height: 1.5rem;
            left: 30px;
          }
        }
      `}
    </style>
  </div>
);
