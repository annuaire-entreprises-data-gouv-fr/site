import { getDatapassDemande } from '#clients/datapass';
import { IDatapassHabilitation } from '#clients/datapass/interface';
import { HttpNotFound } from '#clients/exceptions';
import { parseAgentScopes } from '#clients/roles-data/parse';
import { Exception, FetchRessourceException } from '#models/exceptions';
import { Siret } from '#utils/helpers';
import { logFatalErrorInSentry } from '#utils/sentry';
import { defaultAgentScopes } from '../agent/scopes/constants';

export class HabilitationVerificationFailedException extends Exception {
  constructor(args: { message?: any; context?: { slug: string } }) {
    super({
      name: 'HabilitationVerificationFailed',
      ...args,
    });
  }
}

export class Habilitation {
  private static mapDatapassScopesToIAgentScopes(
    habilitation: IDatapassHabilitation
  ) {
    const rawScopes = habilitation.data.scopes
      .replace('[', '')
      .replace(']', '')
      .replaceAll('"', '')
      .replaceAll(',', '');

    const { validScopes, inValidScopes } = parseAgentScopes(rawScopes);

    if (inValidScopes.length > 0) {
      throw new HabilitationVerificationFailedException({
        message: `Certains droits associés à la demande sont invalides (${inValidScopes.join(
          ', '
        )}). Contactez-nous pour résoudre le problème.`,
      });
    }

    return [...defaultAgentScopes, ...validScopes];
  }

  static async verify(demandeId: number, userEmail: string) {
    try {
      const demande = await getDatapassDemande(demandeId);

      if (demande.state !== 'validated') {
        throw new HabilitationVerificationFailedException({
          message: `La demande d’habilitation ${demandeId} n’est pas validée`,
        });
      }

      const activeHabilitation = demande.habilitations.find(
        (h) => h.state === 'active'
      );

      if (!activeHabilitation) {
        throw new HabilitationVerificationFailedException({
          message: `Aucune habilitations n’est associée a cette demande`,
        });
      }

      if (userEmail !== demande.applicant?.email) {
        throw new HabilitationVerificationFailedException({
          message: `Seule la personne ayant remplit la demande peut l’utiliser pour créer un groupe`,
        });
      }

      const contractUrl = `${process.env.DATAPASS_URL}/habilitations/${activeHabilitation.slug}`;
      const scopes = this.mapDatapassScopesToIAgentScopes(activeHabilitation);

      return {
        contractUrl,
        contractDescription: `Habilitation DATAPASS n° ${activeHabilitation.id}`,
        scopes,
        siret: demande.organisation.siret as Siret,
      };
    } catch (error) {
      if (error instanceof HttpNotFound) {
        throw new HabilitationVerificationFailedException({
          message: `Cette demande n’existe pas`,
        });
      }
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
