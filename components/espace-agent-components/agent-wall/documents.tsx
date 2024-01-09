import routes from '#clients/routes';
import { IUniteLegale } from '#models/index';
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
          <b>Comment accéder à ces documents autrement ?</b>
          <p>
            Les <b>particuliers, salariés</b> et <b>entrepreneurs</b>, peuvent
            consulter cette donnée sur l’onglet document de{' '}
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
