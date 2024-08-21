import React from 'react';
import { Warning } from '#components-ui/alerts';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { INPI } from '#components/administrations';
import { DataSection } from '#components/section/data-section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';

type IProps = {
  uniteLegale: IUniteLegale;
};

/**
 * Dirigeants section
 * @param param0
 * @returns
 */
const BeneficiairesSection: React.FC<IProps> = ({ uniteLegale }) => {
  return (
    <>
      <HorizontalSeparator />
      <DataSection
        id="beneficiaires"
        title="Bénéficiaire(s) effectif(s)"
        sources={[EAdministration.INPI]}
        data={uniteLegale}
      >
        {(uniteLegale) =>
          uniteLegale.dateMiseAJourInpi ? (
            <WarningRBE />
          ) : (
            <>
              Cette structure n’est pas enregistrée au{' '}
              <strong>Registre National des Entreprises (RNE)</strong>
            </>
          )
        }
      </DataSection>
    </>
  );
};
export default BeneficiairesSection;

const WarningRBE = () => (
  <Warning>
    À compter du 31 juillet 2024, le registre des bénéficiaires effectifs{' '}
    <a href="/faq/registre-des-beneficiaires-effectifs">
      n’est plus accessible sur le site
    </a>
    , en application de la{' '}
    <a
      href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049761732"
      target="_blank"
      rel="noopener noreferrer"
    >
      directive européenne 2024/1640 du 31 mai 2024
    </a>
    . Désormais, les{' '}
    <a
      href="https://www.inpi.fr/faq/qui-peut-acceder-aux-donnees-des-beneficiaires-effectifs"
      target="_blank"
      rel="noopener noreferrer"
    >
      personnes en mesure de justifier d’un intérêt légitime
    </a>{' '}
    peuvent{' '}
    <a
      href="https://data.inpi.fr/content/editorial/acces_BE"
      target="_blank"
      rel="noopener noreferrer"
    >
      effectuer une demande d’accès
    </a>{' '}
    au registre auprès de l’
    <INPI />.
    <br />
    Nous travaillons avec la Direction générale du Trésor et l’
    <INPI /> afin de rendre le registre accessible aux administrations, via
    l’espace agent public.
  </Warning>
);
