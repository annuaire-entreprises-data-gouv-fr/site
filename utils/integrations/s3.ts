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
      Bucket: 'annuaire-entreprises-droits-agents',
      Key: 'KEY',
    },
  },
};

export async function readFromS3(bucketKey: keyof typeof bucketsLists) {
  // a client can be shared by different commands.
  const { config, params } = bucketsLists[bucketKey];

  if (!config.credentials.accessKeyId || !config.credentials.secretAccessKey) {
    throw new Error('Missing S3 credentials');
  }

  const client = new S3Client(config);
  const command = new GetObjectCommand(params);

  try {
    const data = await client.send(command);
    console.log(data);
    return data;
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
