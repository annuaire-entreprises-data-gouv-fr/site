import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';

const bucketsLists = {
  'comptes-agents': 'ID',
};

// a client can be shared by different commands.
const client = new S3Client({ region: 'REGION' });

export async function readFromS3(tableKey: keyof typeof bucketsLists) {
  const params = {
    /** input parameters */
  };
  const command = new ListBucketsCommand(params);

  try {
    const data = await client.send(command);
    return data;
  } catch (error) {
    // error handling.
  } finally {
    // finally.
  }
}
