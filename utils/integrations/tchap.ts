import httpClient from '#utils/network';

export default async function logInTchap(text: string) {
  if (!process.env.TCHAP_HOOK && !process.env.TCHAP_ROOM_ID) {
    throw new Error('TCHAP ENV variables manquantes');
  }

  await httpClient({
    url: process.env.TCHAP_HOOK,
    method: 'POST',
    data: {
      message: text,
      roomId: process.env.TCHAP_ROOM_ID,
    },
  });
}
