import { h, render } from 'preact';
import { useState } from 'preact/hooks';

const Widget = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const click = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    fetch(props.href).then((response) => {
      try {
        response.blob().then((blob) => {
          console.log(blob);
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

const mountPoint = document.querySelector(
  '[data-partial-widget="button-async"]'
);

const href = mountPoint.dataset.href;
render(<Widget href={href} />, mountPoint);
