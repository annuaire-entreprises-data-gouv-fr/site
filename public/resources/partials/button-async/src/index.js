import { h, render } from 'preact';
import { useState } from 'preact/hooks';
import register from 'preact-custom-element';

const ButtonAsync = (props) => {
  const [isLoading, setIsLoading] = useState(false);

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
    <button onClick={click}>
      {isLoading ? 'Téléchargement en cours' : 'Télécharger'}
    </button>
  );
};

register(ButtonAsync, 'partial-button-async', ['href']);
