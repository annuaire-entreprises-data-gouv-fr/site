import FAQLink from '#components-ui/faq-link';
import { ESSFrance, INSEE } from '#components/administrations';
import { DataSection } from '#components/section/data-section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IESS } from '#models/certifications/ess';

const ESSFAQLink = () => (
  <FAQLink
    tooltipLabel="l’Economie Sociale et Solidaire"
    to="/definitions/economie-sociale-et-solidaire-ess"
  >
    L’Economie Sociale et Solidaire (ESS) regroupe&nbsp;:
    <br />
    <ul>
      <li>Les associations</li>
      <li>Les fondations </li>
      <li>Les coopératives</li>
      <li>Les mutuelles </li>
      <li>Les « entreprises de l’ESS »</li>
    </ul>
  </FAQLink>
);

const ESSNotFound = () => (
  <>
    Cette structure <strong>n’apparait pas</strong> dans la liste des
    entreprises de <ESSFAQLink /> tenue par <ESSFrance />, tandis que l’
    <INSEE /> indique qu’elle releve du champs de l’ESS, ce qui est inhabituel.
    <p>Il existe plusieurs explications possibles :</p>
    <ul>
      <li>soit c’est une société commerciale de l’ESS</li>
      <li>soit c’est une structure inactive qui a été retirée de la liste</li>
      <li>
        soit c’est une structure récente qui sera bientôt ajoutée à la liste
      </li>
      <li>soit c’est une erreur dans la base SIRENE</li>
    </ul>
  </>
);

export const CertificationESSSection = ({
  ess,
}: {
  ess: IESS | IAPINotRespondingError;
}) => (
  <DataSection
    title="ESS - Entreprise Sociale et Solidaire"
    id="ess"
    sources={[EAdministration.ESSFRANCE, EAdministration.INSEE]}
    data={ess}
    notFoundInfo={<ESSNotFound />}
  >
    {(ess) => (
      <>
        Cette structure apparait dans la liste des entreprises de <ESSFAQLink />{' '}
        tenue par <ESSFrance />.
        <br />
        <br />
        <TwoColumnTable
          body={[
            ['Nom', ess.nom],
            ['Famille juridique', ess.familleJuridique],
            [
              <>
                <FAQLink tooltipLabel="CRESS">
                  Chambre régionale de l’économie sociale et solidaire ou
                  Chambre régionale d’économie sociale
                </FAQLink>{' '}
              </>,
              ess.region,
            ],
          ]}
        />
      </>
    )}
  </DataSection>
);
