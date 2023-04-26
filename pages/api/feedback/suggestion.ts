import { Client } from '@notionhq/client';
import { NextApiRequest, NextApiResponse } from 'next';
import httpClient from '#utils/network';
import logErrorInSentry from '#utils/sentry';

const notion = new Client({ auth: process.env.NOTION_API_SECRET });
const databaseId = process.env.NOTION_DATABASE_ID;

const logAllEvents = async (req: NextApiRequest) => {
  try {
    await logSuggestionToNotion(req);
    await logInMattermost(req);
  } catch (e: any) {
    logErrorInSentry('Error in form submission matomo', {
      details: e.toString(),
    });
  }
};

async function logInMattermost(req: NextApiRequest) {
  const NA = 'Non renseigné';
  const data = {
    username: 'clippy',
    text: `Visiteur : ${
      req.body['radio-set-visitor-type'] || NA
    } \nSuggestion : ${
      req.body['textarea'] || NA
    } \nLien notion : https://www.notion.so/apigouv/ce7d271037bb4fa0a363e52ac1411e8b?v=a5c2c84d69e7486d9c1c9b9ae90e9f2f&pvs=4`,
  };
  await httpClient({
    url: process.env.MATTERMOST_HOOK,
    method: 'POST',
    data,
  });
}

async function logSuggestionToNotion(req: NextApiRequest) {
  try {
    await notion.pages.create({
      parent: { database_id: databaseId as string },
      properties: {
        Email: {
          title: [
            {
              text: {
                content: req.body['email'],
              },
            },
          ],
        },
        Suggestion: {
          rich_text: [
            {
              text: {
                content: req.body['textarea'],
              },
            },
          ],
        },
        "Type d'utilisateur": {
          select: { name: req.body['radio-set-visitor-type'] },
        },
        Date: {
          date: { start: new Date().toISOString() },
        },
      },
    });
  } catch (error) {
    logErrorInSentry('Error in form submission notion', {
      // @ts-ignore
      details: error.body,
    });
  }
}

const saveAndRedirect = async (req: NextApiRequest, res: NextApiResponse) => {
  // we choose not to await as we dont want to stall the request if any logEvent fails
  logAllEvents(req);
  res.writeHead(302, {
    Location: '/suggestion/merci',
  });
  res.end();
};

export default saveAndRedirect;
