import { useMemo } from 'react';
import routes from '#clients/routes';
import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import { INPI } from '#components/administrations';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { FullTable } from '#components/table/full';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { IBeneficairesEffectif } from '#models/espace-agent/beneficiaires';
import { UseCase } from '#models/user/agent';
import { ISession } from '#models/user/session';
import { formatDatePartial } from '#utils/helpers';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

/**
 * Dirigeants section
 * @param param0
 * @returns
 */
const ProtectedBeneficiairesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
  useCase: UseCase;
}> = ({ uniteLegale, session, useCase }) => {
  const params = useMemo(
    () => ({
      params: { useCase },
    }),
    [useCase]
  );
  const beneficiaires = useAPIRouteData(
    'espace-agent/beneficiaires',
    uniteLegale.siren,
    session,
    params
  );

  return (
    <>
      <AsyncDataSectionClient
        id="beneficiaires"
        title="Bénéficiaire(s) effectif(s)"
        sources={[EAdministration.INPI]}
        notFoundInfo={
          <>
            Cette structure n’est pas enregistrée au{' '}
            <strong>Registre National des Entreprises (RNE)</strong>
          </>
        }
        data={beneficiaires}
        isProtected
      >
        {(beneficiaires) => (
          <>
            <BénéficiairesContent
              beneficiaires={beneficiaires}
              uniteLegale={uniteLegale}
            />
          </>
        )}
      </AsyncDataSectionClient>
    </>
  );
};

function BénéficiairesContent({
  beneficiaires,
  uniteLegale,
}: {
  beneficiaires: IBeneficairesEffectif[];
  uniteLegale: IUniteLegale;
}) {
  const formatInfos = (beneficiaire: IBeneficairesEffectif) => [
    <>
      {beneficiaire.prenoms}
      {beneficiaire.prenoms && ' '}
      {(beneficiaire.nom || '').toUpperCase()}, né(e) en{' '}
      {formatDatePartial(
        `${beneficiaire.anneeNaissance}-${beneficiaire.moisNaissance}-00`
      )}
      {beneficiaire.nationalite && ` (${beneficiaire.nationalite})`}
      {(beneficiaire.modalites
        .representant_legal_placement_sans_gestion_deleguee && (
        <Tag color="agent">
          <FAQLink tooltipLabel="Représentant légal en placement">
            Le bénéficiaire est représentant légal en placement sans gestion
            déléguée
          </FAQLink>
        </Tag>
      )) ||
        (beneficiaire.modalites.representant_legal && (
          <Tag color="agent">Représentant légal</Tag>
        ))}
    </>,
    beneficiaire.paysResidence,
    <>
      <ul className="no-style">
        <li>
          <FAQLink tooltipLabel="Part totale">
            Pourcentage total du capital détenu et déclaré par le bénéficiaire
            qui correspond à la somme des parts directes et indirectes. Ce total
            est soit égal à 0%, soit supérieur ou égal à 25%. En effet, en
            dessous de ce ratio, la personne physique ne déclare pas son
            capital.
          </FAQLink>{' '}
          :{' '}
          <strong>
            {beneficiaire.modalites.detention_de_capital.parts_totale}%
          </strong>
        </li>
        {beneficiaire.modalites.detention_de_capital.parts_directes
          .detention && (
          <li>
            <FAQLink tooltipLabel="Part directes">
              Le bénéficiaire détient du capital direct (parts sociales ou
              actions) de l’unité légale. Par opposition à une détention
              indirecte du capital, via une personne morale.
            </FAQLink>{' '}
            :
            <PartCapitalModalite
              capital={
                beneficiaire.modalites.detention_de_capital.parts_directes
              }
            />
          </li>
        )}
        {!!beneficiaire.modalites.detention_de_capital.parts_indirectes
          .par_indivision.total && (
          <li>
            <FAQLink tooltipLabel="Part en indivision">
              Après un décès, le patrimoine du défunt est en indivision, s’il y
              a plusieurs héritiers. Cela signifie que les biens de la
              succession appartiennent indistinctement à tous les héritiers sans
              que leurs parts respectives ne soient matériellement
              individualisées.
            </FAQLink>{' '}
            :
            <PartCapitalModalite
              capital={
                beneficiaire.modalites.detention_de_capital.parts_indirectes
                  .par_indivision
              }
            />
          </li>
        )}
        {!!beneficiaire.modalites.detention_de_capital.parts_indirectes
          .via_personnes_morales.total && (
          <li>
            <FAQLink tooltipLabel="Part via personne morale">
              Les parts indirectes peuvent être détenues par le biais d’une ou
              de plusieurs personnes morales intermédiaires.
            </FAQLink>{' '}
            :
            <PartCapitalModalite
              capital={
                beneficiaire.modalites.detention_de_capital.parts_indirectes
                  .via_personnes_morales
              }
            />
          </li>
        )}
      </ul>
    </>,
    <ul className="no-style">
      <li>
        <FAQLink tooltipLabel="Total des droits">
          Pourcentage total des droits de vote détenus et déclarés par le
          bénéficiaire qui correspond à la somme des droits de vote directs et
          indirects. Ce total est soit égal à 0%, soit supérieur ou égal à 25%.
          En effet, en dessous de ce ratio, la personne physique ne déclare pas
          ses droits de vote.
        </FAQLink>{' '}
        : <strong>{beneficiaire.modalites.droits_de_vote.total}%</strong>
      </li>
      {beneficiaire.modalites.droits_de_vote.directes.detention && (
        <li>
          <FAQLink tooltipLabel="Droits directs">
            Le bénéficiaire détient du capital direct (parts sociales ou
            actions) de l’unité légale. Par opposition à une détention indirecte
            du capital, via une personne morale.
          </FAQLink>{' '}
          :
          <PartCapitalModalite
            capital={beneficiaire.modalites.droits_de_vote.directes}
          />
        </li>
      )}
      {!!beneficiaire.modalites.droits_de_vote.indirectes.par_indivision
        .total && (
        <li>
          <FAQLink tooltipLabel="Droits en indivision">
            Après un décès, le patrimoine du défunt est en indivision, s’il y a
            plusieurs héritiers. Cela signifie que les biens de la succession
            appartiennent indistinctement à tous les héritiers sans que leurs
            parts respectives ne soient matériellement individualisées.
          </FAQLink>{' '}
          :
          <PartCapitalModalite
            capital={
              beneficiaire.modalites.droits_de_vote.indirectes.par_indivision
            }
          />
        </li>
      )}
      {!!beneficiaire.modalites.droits_de_vote.indirectes.via_personnes_morales
        .total && (
        <li>
          <FAQLink tooltipLabel="Droits via personne morale">
            Les droits indirectes peuvent être détenues par le biais d’une ou de
            plusieurs personnes morales intermédiaires.
          </FAQLink>{' '}
          :
          <PartCapitalModalite
            capital={
              beneficiaire.modalites.droits_de_vote.indirectes
                .via_personnes_morales
            }
          />
        </li>
      )}
    </ul>,
    <ul className="no-style">
      {beneficiaire.modalites.pouvoirs_de_controle.decision_ag && (
        <li>
          <Tag>
            <FAQLink tooltipLabel="Décision AG">
              Le bénéficiaire effectif a le pouvoir de décision en assemblée
              générale.
            </FAQLink>
          </Tag>
        </li>
      )}
      {beneficiaire.modalites.pouvoirs_de_controle
        .nommage_membres_conseil_administratif && (
        <li>
          <Tag>
            <FAQLink tooltipLabel="Nommage membres CA">
              Le bénéficiaire effectif a le pouvoir de nommer les membres du
              conseil d’administration.
            </FAQLink>
          </Tag>
        </li>
      )}
      {beneficiaire.modalites.pouvoirs_de_controle.autres && (
        <li>
          <Tag>
            <FAQLink tooltipLabel="Autres pouvoirs">
              Le bénéficiaire effectif a d’autres pouvoirs de contrôle.
            </FAQLink>
          </Tag>
        </li>
      )}
    </ul>,
  ];

  const plural = beneficiaires.length > 1 ? 's' : '';

  return (
    <>
      {beneficiaires.length === 0 ? null : (
        <>
          <p>
            Cette entreprise possède {beneficiaires.length}{' '}
            <a
              rel="noreferrer noopener"
              target="_blank"
              href="https://www.inpi.fr/fr/faq/qu-est-ce-qu-un-beneficiaire-effectif"
            >
              bénéficiaire{plural} effectif{plural}
            </a>{' '}
            enregistré{plural} au{' '}
            <strong>Registre National des Entreprises (RNE)</strong> tenu par l’
            <INPI />. Retrouvez le détail des modalités de contrôle sur{' '}
            <UniteLegalePageLink
              uniteLegale={uniteLegale}
              href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
              siteName="le site de l’INPI"
            />
            &nbsp;:
          </p>
          <FullTable
            verticalAlign="top"
            head={[
              'Bénéficiaire',
              'Pays',
              'Détention de capital',
              'Droits de vote',
              'Pouvoirs de contrôle',
            ]}
            body={beneficiaires.map((beneficiaire) =>
              formatInfos(beneficiaire)
            )}
          />
        </>
      )}
      <style global jsx>{`
        table > tbody > tr > td:first-of-type {
          width: 30%;
        }
      `}</style>
    </>
  );
}

function PartCapitalModalite({
  capital,
}: {
  capital: {
    pleine_propriete: number;
    nue_propriete: number;
    total?: number;
    usufruit?: number;
  };
}) {
  return (
    <>
      {!!capital.total && <strong>{capital.total}%</strong>}
      <ul>
        {capital.pleine_propriete && (
          <li>{capital.pleine_propriete}% en pleine propriété</li>
        )}

        {!!capital.nue_propriete && (
          <li>{capital.nue_propriete}% en nue propriété</li>
        )}
        {!!capital.usufruit && <li>{capital.usufruit}% en usufruit</li>}
      </ul>
    </>
  );
}

export default ProtectedBeneficiairesSection;
