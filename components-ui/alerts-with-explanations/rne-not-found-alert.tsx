import ButtonLink from '#components-ui/button';
import { INPI } from '#components/administrations';
import AvisSituationLink from '#components/justificatifs/avis-situation-link';
import { IUniteLegale } from '#models/core/types';
import { Warning } from '../alerts';

const ImmatriculationRNENotFoundAlert: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => (
  <Warning full>
    <strong>
      L’Immatriculation au Registre National des Entreprises (RNE) est
      introuvable
    </strong>
    <p>
      Nous n’avons <strong>pas retrouvé l’immatriculation</strong> de cette
      entreprise dans le RNE tenu par l’
      <INPI />.
    </p>
    <p>
      Selon l’
      <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044046311">
        Art.L123-36 du Code de Commerce
      </a>
      , en vigueur depuis le 01 janvier 2023 :{' '}
      <i>
        “il est tenu un registre national des entreprises, auquel
        s’immatriculent les entreprises exerçant sur le territoire français une
        activité de nature commerciale, artisanale, agricole ou indépendante.”
      </i>
    </p>
    <p>
      Si cette structure est une entreprise commerciale, artisanale, agricole ou
      indépendante, <strong>elle doit être enregistrée au RNE</strong>. Le fait
      qu’elle soit introuvable{' '}
      <strong>est anormal et le problème doit être remonté</strong> à l’
      <INPI /> pour y être résolu.
    </p>
    <div className="layout-center">
      <ButtonLink to="https://www.inpi.fr/contactez-nous" alt small>
        Remonter le problème à l’INPI
      </ButtonLink>
    </div>
    <br />
    En l’absence de justificatif d’immatriculation, vous pouvez télécharger{' '}
    <AvisSituationLink
      etablissement={uniteLegale.siege}
      label="l’avis de situation Insee du siège social"
    />
    .
  </Warning>
);

export default ImmatriculationRNENotFoundAlert;
