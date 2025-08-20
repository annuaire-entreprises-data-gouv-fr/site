import { getDatapassDemande } from '#clients/datapass';
import { IDatapassDemandeResponse } from '#clients/datapass/interface';
import { Exception, FetchRessourceException } from '#models/exceptions';
import { Siret } from '#utils/helpers';
import { logFatalErrorInSentry } from '#utils/sentry';

export class HabilitationVerificationFailedException extends Exception {
  constructor(args: { message?: any; context?: { slug: string } }) {
    super({
      name: 'HabilitationVerificationFailed',
      ...args,
    });
  }
}

export class Habilitation {
  private static mapDemandeToScopes(demande: IDatapassDemandeResponse) {
    // const formUid = demande.form_uid;
    //   let scopesArray: IAgentScope[] = [];
    //   if (formUid === 'annuaire-des-entreprises-marches-publics') {
    //     scopesArray = marchePublicScopes;
    //   } else if (formUid === 'annuaire-des-entreprises-aides-publiques') {
    //     scopesArray = aidesPubliquesScopes;
    //   } else if (
    //     formUid === 'annuaire-des-entreprises-lutte-contre-la-fraude'
    //   ) {
    //     scopesArray = lutteContreLaFraudeScopes;
    //   } else if (
    //     formUid === 'annuaire-des-entreprises-subventions-associations'
    //   ) {
    //     scopesArray = subventionsAssociationsScopes;
    //   }

    return '';
  }

  static async verify(demandeId: number, userEmail: string) {
    try {
      /**
       * Get all groups that a user belongs to
       */
      const demande = await getDatapassDemande(demandeId);

      if (demande.state !== 'validated') {
        throw new HabilitationVerificationFailedException({
          message: `La demande d’habilitation ${demandeId} n’est pas validée`,
        });
      }

      const validHabilitations = demande.habilitations.filter(
        (h) => !h.revoked
      );
      if (validHabilitations.length === 0) {
        throw new HabilitationVerificationFailedException({
          message: `Aucune habilitations n’est associée a cette demande`,
        });
      }

      if (userEmail !== demande.applicant?.email) {
        throw new HabilitationVerificationFailedException({
          message: `Seule la personne ayant remplit la demande peut l’utiliser pour créer un groupe`,
        });
      }

      const contractUrl = `${process.env.DATAPASS_URL}/instruction/demandes/${demandeId}`;

      const scopes = this.mapDemandeToScopes(demande);

      return {
        contractUrl,
        contractDescription: `DATAPASS : demande ${demandeId} | habilitation ${validHabilitations[0].id}`,
        scopes,
        siret: demande.organisation.siret as Siret,
      };
    } catch (error) {
      logFatalErrorInSentry(
        new FetchRessourceException({
          ressource: 'Datapass',
          message: 'Failed to verify habilitation',
          cause: error,
        })
      );
      throw error;
    }
  }
}
