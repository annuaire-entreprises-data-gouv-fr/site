import React, { ComponentType, useEffect, useState } from 'react';

function withWebGL<T>(WrappedComponent: ComponentType<T>): React.FC<T> {
  const WithWebGLCheck: React.FC<T> = (props) => {
    const [hasWebGL, setHasWebGL] = useState(false);

    useEffect(() => {
      const checkWebGLSupport = () => {
        const canvas = document.createElement('canvas');
        const gl =
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return gl !== null && gl !== undefined;
      };

      setHasWebGL(checkWebGLSupport());
    }, []); // Run once when the component mounts

    if (!hasWebGL) {
      return (
        <div>
          <i>
            WebGL n’est pas supporté par votre navigateur. Malheureusement,
            WebGL est nécessaire au bon fonctionnement de la carte.
          </i>
        </div>
      );
    }

    //@ts-ignore
    return <WrappedComponent {...props} />;
  };

  return WithWebGLCheck;
}

export default withWebGL;
