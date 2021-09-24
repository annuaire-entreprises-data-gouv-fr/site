import { h, Fragment } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import register from 'preact-custom-element';

const DownloadIcon = () => (
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

const Loader = () => (
  <div className="loader">
    <span></span>
    <span></span>
  </div>
);

const Styles = (props) => (
  <style>
    {`

.button-link .error-message {
  color:red;
  font-size:0.9rem;
  font-weight:bold;
}

.button-link button {
  cursor: ${props.isLoading} ? 'progress' : 'pointer';
  flex-direction: 'row';
  display: 'flex';
}

.loader {
  margin: auto;
  width: 25px;
  height: 25px;
  display: inline-block;
  padding: 0px;
  text-align: left;
}
.loader span {
  position: absolute;
  display: inline-block;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  background: #fff;
  -webkit-animation: loader 1s linear infinite;
  animation: loader 1s linear infinite;
}
.loader span:last-child {
  animation-delay: -0.4s;
  -webkit-animation-delay: -0.4s;
}

.loader-container > .message {
  font-style: italic;
  margin: 20px auto;
}
@keyframes loader {
  0% {
    transform: scale(0, 0);
    opacity: 0.8;
  }
  100% {
    transform: scale(1, 1);
    opacity: 0;
  }
}
@-webkit-keyframes loader {
  0% {
    -webkit-transform: scale(0, 0);
    opacity: 0.8;
  }
  100% {
    -webkit-transform: scale(1, 1);
    opacity: 0;
  }
}
`}
  </style>
);

const ERROR =
  "Le téléservice ne répond pas. Merci d’utiliser le lien vers le site de l'INPI à la place";

const ButtonAsync = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const instance = useRef(null);

  useEffect(() => {
    if (!props.clean) {
      return;
    }
    const elementToClean = document.getElementById(props.clean);
    if (elementToClean) {
      elementToClean.remove();
    }
  }, [props.clean]);

  const click = () => {
    if (isLoading) {
      return;
    }
    setError(null);
    setIsLoading(true);
    fetch(props.to)
      .then((response) => {
        try {
          response.blob().then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'immatriculation.pdf';
            a.click();
          });
        } catch (e) {
          setError(ERROR);
          window.location.href = response.url;
        } finally {
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setError(ERROR);
        setIsLoading(false);
      });
  };

  return (
    <div className="button-link" ref={instance}>
      <Styles isLoading={isLoading} />
      {error && <div className="error-message">{error}</div>}
      <button onClick={click}>
        {isLoading ? (
          <Fragment>
            <Loader />
            <div>
              <i>Téléchargement en cours</i>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <DownloadIcon />
            <span>Télécharger le justificatif d’immatriculation</span>
          </Fragment>
        )}
      </button>
    </div>
  );
};

register(ButtonAsync, 'partial-button-async', ['clean', 'to']);
