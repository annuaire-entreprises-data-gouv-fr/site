import routes from '#clients/routes';
import { Info } from '#components-ui/alerts';
import InpiPartiallyDownWarning from '#components-ui/alerts-with-explanations/inpi-partially-down';
import { INPI } from '#components/administrations';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { IDirigeantsFetching } from '.';
import { DirigeantContent } from './dirigeant-content';

type IProps = {
  dirigeants: IDirigeantsFetching;
  uniteLegale: IUniteLegale;
  isProtected: boolean;
  warning: JSX.Element;
};

/**
 * Dirigeants section
 */
function DirigeantsSection({
  uniteLegale,
  dirigeants,
  isProtected,
  warning,
}: IProps) {
  const sources = [EAdministration.INPI];

  if (isProtected) {
    sources.push(EAdministration.INFOGREFFE);
  }

  return (
    <AsyncDataSectionClient
      id="rne-dirigeants"
      title="Dirigeant(s)"
      sources={sources}
      data={dirigeants}
      isProtected={isProtected}
      notFoundInfo={
        <>
          Cette structure n’est pas enregistrée au{' '}
          <strong>Registre National des Entreprises (RNE)</strong>
        </>
      }
    >
      {(dirigeants) => {
        const plural = dirigeants.data.length > 1 ? 's' : '';
        return (
          <>
            {dirigeants.metadata?.isFallback && <InpiPartiallyDownWarning />}
            {warning ? warning : null}
            {isProtected ? (
              <Info>
                Ces informations proviennent d’
                <a
                  rel="noopener"
                  target="_blank"
                  href={`${routes.infogreffe.portail.home}`}
                  aria-label="Visiter le site d’Infogreffe, nouvelle fenêtre"
                >
                  Infogreffe
                </a>{' '}
                et incluent la date de naissance des dirigeant(e)s.
              </Info>
            ) : null}
            {dirigeants.data.length === 0 ? (
              <p>
                Cette entreprise est enregistrée au{' '}
                <strong>Registre National des Entreprises (RNE)</strong>, mais
                n’y possède aucun dirigeant.
              </p>
            ) : (
              <>
                <p>
                  Cette entreprise possède {dirigeants.data.length} dirigeant
                  {plural} enregistré{plural} au{' '}
                  <strong>Registre National des Entreprises (RNE)</strong> tenu
                  par l’
                  <INPI />. Pour en savoir plus, vous pouvez consulter{' '}
                  <UniteLegalePageLink
                    href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
                    uniteLegale={uniteLegale}
                    siteName="le site de l’INPI"
                  />
                  &nbsp;:
                </p>

                <DirigeantContent
                  dirigeants={dirigeants}
                  uniteLegale={uniteLegale}
                />
              </>
            )}
          </>
        );
      }}
    </AsyncDataSectionClient>
  );
}

export default DirigeantsSection;
