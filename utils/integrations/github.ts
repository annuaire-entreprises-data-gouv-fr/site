import constants from '#models/constants';
import { Exception } from '#models/exceptions';
import httpClient from '#utils/network';
import logErrorInSentry from '#utils/sentry';

const owner = 'annuaire-entreprises-data-gouv-fr';
const repo = 'secret_repository_name';
const filePath = 'super-agents.json';
const branch = 'main';
const token = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

interface GithubContentResponse {
  content: string;
}

export async function readFromGithub() {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

  try {
    const response = await httpClient<GithubContentResponse>({
      method: 'GET',
      url,
      headers: {
        Authorization: `token ${token}`,
      },
      timeout: constants.timeout.XXL,
    });

    const decodedContent = Buffer.from(response.content, 'base64').toString(
      'utf-8'
    );

    return JSON.parse(decodedContent);
  } catch (error) {
    logErrorInSentry(new ReadFromGithubException({ cause: error }));
    throw error;
  }
}

class ReadFromGithubException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      ...args,
      name: 'ReadFromGithubException',
    });
  }
}
