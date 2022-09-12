import React from 'react';
import { Loader } from '../../components-ui/loader';
import FrontStateMachine from '../front-state-machine';
import { CopyPaste } from '../table/simple';

const TVACell: React.FC<{}> = ({}) => {
  return (
    <FrontStateMachine
      id="tva-cell-wrapper"
      states={[
        <i>Non renseigné</i>,
        <Loader />,
        <CopyPaste id="tva-cell-result">
          <i>Non renseigné</i>
        </CopyPaste>,
        <i>
          Le téléservice du VIES ne fonctionne pas actuellement. Merci de
          ré-essayer plus tard.
        </i>,
      ]}
    />
  );
};

export default TVACell;
