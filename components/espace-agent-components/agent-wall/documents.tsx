import routes from '#clients/routes';
import { IUniteLegale } from '#models/core/types';
import AgentWall from '.';

const AgentWallDocuments: React.FC<{
  title: string;
  id: string;
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale, id, title }) => {
  return (
    <AgentWall
      id={id}
      title={title}
      modalFooter={
        <>
          <h3>Comment accéder à ces documents autrement ?</h3>
          <p>
            Les <strong>particuliers, salariés</strong> et{' '}
            <strong>entrepreneurs</strong>, peuvent consulter cette donnée sur
            l’onglet document de{' '}
            <a href={routes.rne.portail.entreprise + uniteLegale.siren}>
              la page data.inpi.fr de cette entreprise
            </a>
            .
          </p>
        </>
      }
    />
  );
};

export default AgentWallDocuments;
