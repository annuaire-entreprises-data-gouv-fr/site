import { NextApiRequest, NextApiResponse } from 'next';
import { FetchRessourceException } from '#models/exceptions';
import getImmatriculationRNE from '#models/immatriculation/rne';
import { NotASirenError, NotLuhnValidSirenError } from '#models/index';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { withAPM } from '#utils/sentry/tracing';
import withAntiBot from '#utils/session/with-anti-bot';

const getRNE = async (
  { query: { slug = '' } }: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const siren = verifySiren(slug as string);
    const immatriculation = await getImmatriculationRNE(siren);
    res.status(200).json(immatriculation);
  } catch (e: any) {
    let message: string;

    if (e instanceof NotASirenError || e instanceof NotLuhnValidSirenError) {
      message = e.message;
      res.status(400);
    } else {
      message = 'Failed to fetch RNE immatriculation';
      res.status(500);
    }
    res.json({ message });
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'RNEImmatriculation',
        message,
        context: {
          slug: slug as string,
        },
      })
    );
  }
};

class FetchRNEImmatriculationException extends Error {
  name = 'FetchRNEImmatriculationException';
}

export default withAPM(withAntiBot(getRNE));
