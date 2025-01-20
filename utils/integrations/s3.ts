import {
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
} from '#clients/exceptions';
import { Exception } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

const bucketsLists = {
  'comptes-agents': {
    config: {
      endpoint: 'https://s3.eu-west-par.io.cloud.ovh.net/',
      credentials: {
        accessKeyId: process.env.OVH_S3_ACCESS_KEY || '',
        secretAccessKey: process.env.OVH_S3_SECRET || '',
      },
      region: 'eu-west-par',
    },
    params: {
      Bucket: 'annuaire-entreprises-droits-agentssdfjkn',
      Key: 'comptes_agents.json',
    },
  },
};

export async function readFromS3(
  bucketKey: keyof typeof bucketsLists
): Promise<string> {
  // a client can be shared by different commands.
  const { config, params } = bucketsLists[bucketKey];

  if (!config.credentials.accessKeyId || !config.credentials.secretAccessKey) {
    throw new Error('Missing S3 credentials');
  }

  const client = new S3Client(config);

  const getBucket = (params: { Bucket: string; Key: string }) =>
    new Promise(async (resolve, reject) => {
      const getObjectCommand = new GetObjectCommand(params);

      try {
        const response = await client.send(getObjectCommand);

        // Store all of data chunks returned from the response data stream
        // into an array then use Array#join() to use the returned contents as a String
        //@ts-ignore
        let responseDataChunks = [];

        // Handle an error while streaming the response body
        //@ts-ignore
        response.Body.once('error', (err) => reject(err));

        // Attach a 'data' listener to add the chunks of data to our array
        // Each chunk is a Buffer instance
        //@ts-ignore
        response.Body.on('data', (chunk) => responseDataChunks.push(chunk));

        // Once the stream has no more data, join the chunks into a string and return the string
        //@ts-ignore
        response.Body.once('end', () => resolve(responseDataChunks.join('')));
      } catch (err: any) {
        const statusCode = err['$metadata']?.httpStatusCode;
        if (statusCode === 404) {
          return reject(new HttpNotFound(err.Code));
        }
        if (statusCode === 403) {
          return reject(new HttpForbiddenError(err.Code));
        }
        return reject(new HttpServerError(err.Code));
      }
    });

  try {
    const data = await getBucket(params);
    return data as string;
  } catch (error) {
    logErrorInSentry(new readFromS3Exception({ cause: error }));
    throw error;
  }
}

class readFromS3Exception extends Exception {
  constructor(args: { cause?: any }) {
    super({
      ...args,
      name: 'readFromS3Exception',
    });
  }
}
