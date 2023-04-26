import httpClient from '#utils/network';

type IMattermostData = {
  username: string;
  text: string;
};

export default async function logInMattermost(data: IMattermostData) {
  if (!process.env.MATTERMOST_HOOK) {
    throw new Error('MATTERMOST_HOOK manquant');
  }

  await httpClient({
    url: process.env.MATTERMOST_HOOK,
    method: 'POST',
    data,
  });
}
