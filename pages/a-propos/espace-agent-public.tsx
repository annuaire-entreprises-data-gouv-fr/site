import TextWrapper from '#components-ui/text-wrapper';
import { DINUM } from '#components/administrations';
import Meta from '#components/meta';
import { NextPageWithLayout } from '../_app';

const ExtraitKbis: NextPageWithLayout = () => {
  return (
    <>
      <Meta
        title="Espace agent public de l’Annuaire des Entreprise"
        canonical="https://annuaire-entreprises.data.gouv.fr/a-propos/espace-agent-public"
      />
      <TextWrapper>
        <h1>Qu’est ce que l’espace Agent Public ?</h1>
        <p>
          Avec l’Annuaire des Entreprises, la{' '}
          <a
            href="https://www.numerique.gouv.fr/dinum/"
            target="_blank"
            rel="noreferrer"
          >
            Direction Interministérielle du Numérique (DINUM)
          </a>
          , en coopération avec la{' '}
          <a
            href="https://entreprises.gouv.fr/"
            target="_blank"
            rel="noreferrer"
          >
            Direction Générale des Entreprises (DGE)
          </a>{' '}
          propose un moyen efficace de consulter la donnée publique des
          entreprises.
        </p>
        <p>
          Grâce à l’<strong>open data</strong>, tout(e) agent(e),
          entrepreneur(e) et citoyen(ne) peut retrouver facilement les
          principales informations sur une entreprise, un service public ou une
          association françaises.
        </p>
        <p>
          Mais la <DINUM />
        </p>
      </TextWrapper>
    </>
  );
};

export default ExtraitKbis;
