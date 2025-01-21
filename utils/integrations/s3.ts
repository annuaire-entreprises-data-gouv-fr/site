import {
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
} from '#clients/exceptions';
import { Exception } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const bucketsLists = {
  'comptes-agents': {
    config: {
      endpoint: 'https://s3.eu-west-par.io.cloud.ovh.net/',
      credentials: {
        accessKeyId: process.env.OVH_S3_AGENT_ACCESS_KEY || '',
        secretAccessKey: process.env.OVH_S3_AGENT_SECRET || '',
      },
      region: 'eu-west-par',
    },
    params: {
      Bucket: process.env.OVH_S3_AGENT_BUCKET || '',
      Key: 'comptes_agents.json',
    },
  },
};

export async function readFromS3(
  bucketKey: keyof typeof bucketsLists
): Promise<string> {
  // a client can be shared by different commands.
  const { config, params } = bucketsLists[bucketKey];

  if (
    !config.credentials.accessKeyId ||
    !config.credentials.secretAccessKey ||
    !params.Bucket ||
    !params.Key
  ) {
    throw new Error('Missing S3 credentials or incomplete params');
  }

  const client = new S3Client(config);

  const getBucket = (params: { Bucket: string; Key: string }) =>
    new Promise(async (resolve, reject) => {
      const getObjectCommand = new GetObjectCommand(params);

      try {
        const response = await client.send(getObjectCommand);

        // Store all of data chunks returned from the response data stream
        // into an array then use Array#join() to use the returned contents as a String
        const responseDataChunks: Buffer[] = [];
        const stream = response.Body as Readable;

        // Handle an error while streaming the response body
        stream.once('error', (err) => reject(err));

        // Attach a 'data' listener to add the chunks of data to our array
        // Each chunk is a Buffer instance
        stream.on('data', (chunk) => responseDataChunks.push(chunk));

        // Once the stream has no more data, join the chunks into a string and return the string
        stream.once('end', () => resolve(responseDataChunks.join('')));
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
