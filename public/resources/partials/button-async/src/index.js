import { h, render, Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import register from 'preact-custom-element';

const ButtonAsync = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const elementToClean = document.getElementById(props.clean);
    if (elementToClean) {
      elementToClean.remove();
    }
  }, [props]);

  const click = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    fetch(props.to).then((response) => {
      try {
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'immatriculation.pdf';
          a.click();
        });
      } catch {
        window.location.href = response.url;
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="button-link">
      <button
        onClick={click}
        style={{
          cursor: isLoading ? 'progress' : 'pointer',
          flexDirection: 'row',
          display: 'flex',
        }}
      >
        {isLoading ? (
          <Fragment>
            <div className="loader">
              <span></span>
              <span></span>
            </div>
            <span>
              <i>Téléchargement en cours</i>
            </span>
          </Fragment>
        ) : (
          <Fragment>
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
            <span>Télécharger le justificatif d’immatriculation</span>
          </Fragment>
        )}
      </button>
    </div>
  );
};

register(ButtonAsync, 'partial-button-async', ['href']);
