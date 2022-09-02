export const Loader = () => (
  <>
    <span>
      <div className="loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </span>
    <style jsx>
      {`
        .loader {
          display: inline;
        }

        @keyframes loader {
          33% {
            transform: translateY(2px);
          }
          66% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .loader > div:nth-child(1) {
          animation: loader 0.6s -0.14s infinite ease-in-out;
        }

        .loader > div:nth-child(2) {
          animation: loader 0.6s -0.07s infinite ease-in-out;
        }

        .loader > div:nth-child(3) {
          animation: loader 0.6s 0s infinite ease-in-out;
        }

        .loader > div {
          background-color: #999;
          width: 5px;
          height: 5px;
          border-radius: 100%;
          margin: 1px;
          animation-fill-mode: both;
          display: inline-block;
        }
      `}
    </style>
  </>
);
