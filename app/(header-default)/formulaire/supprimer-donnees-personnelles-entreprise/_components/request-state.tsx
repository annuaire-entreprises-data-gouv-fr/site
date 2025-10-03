import { Error, Info, Success } from "#components-ui/alerts";
import ButtonLink from "#components-ui/button";
import { throwUnreachableCaseError } from "#models/exceptions";
import type { IHidePersonalDataRequest } from "#models/protected-siren/request-siren-protection";

type IProps = {
  hidePersonalDataRequest?: IHidePersonalDataRequest;
};
export function RequestState({ hidePersonalDataRequest }: IProps) {
  return (
    <>
      {hidePersonalDataRequest ? (
        hidePersonalDataRequest === "CREATED" ? (
          <Success full>
            <strong>Demande prise en compte</strong>
            <p>
              Votre demande a bien été prise en compte. Elle sera traitée dans
              les deux jours ouvrés.
            </p>
          </Success>
        ) : hidePersonalDataRequest === "DENIED" ? (
          <Error full>
            <strong>Demande refusée</strong>
            <p>
              Votre demande a été refusée. Cela est vraisemblablement dû au fait
              que vous n’apparaissez pas comme dirigeant de l’entreprise.
              Veuillez contacter le support de l’annuaire des entreprises pour
              plus d’informations.
            </p>
          </Error>
        ) : hidePersonalDataRequest === "PENDING" ? (
          <Info>
            <strong>Votre demande est en cours</strong>
            <p>
              Une précédente demande concernant cette entreprise est déjà en
              cours de traitement. Cette dernière devrait être traité dans les
              deux jours ouvrés.
            </p>
          </Info>
        ) : hidePersonalDataRequest === "ACCEPTED" ? (
          <Success>
            <strong>Demande déjà traitée</strong>
            <p>
              Une précédente demande concernant cette entreprise a déjà été
              traitée : les informations personnelles de dirigeant ne sont plus
              affichées sur l’annuaire des entreprises.
            </p>
          </Success>
        ) : (
          throwUnreachableCaseError(hidePersonalDataRequest)
        )
      ) : (
        <div className="fr-callout fr-icon-information-line">
          <h3 className="fr-callout__title">
            Demande à effectuer sur le site de l’INSEE
          </h3>
          <p className="fr-callout__text">
            En tant qu’entrepreneur individuel, vous pouvez utiliser la
            procédure spéciale de l’Insee qui vous permet de disparaitre de tous
            les sites internet d’un coup.
          </p>
          <ButtonLink
            aria-label="Changer mon statut de diffusion sur le site de l'Insee, nouvelle fenêtre"
            target="_blank"
            to="https://statut-diffusion-sirene.insee.fr/"
          >
            Changer mon statut de diffusion
          </ButtonLink>
        </div>
      )}
      <ul className="fr-btns-group fr-btns-group--inline-md fr-btns-group--center">
        <li>
          <ButtonLink
            role="listitem"
            to="/formulaire/supprimer-donnees-personnelles-entreprise"
          >
            Faire une autre demande
          </ButtonLink>
        </li>
        <li>
          <ButtonLink
            alt
            role="listitem"
            to="/api/auth/france-connect/logout?pathFrom=%2Fformulaire%2Fsupprimer-donnees-personnelles-entreprise"
          >
            Me déconnecter
          </ButtonLink>
        </li>
      </ul>
    </>
  );
}
