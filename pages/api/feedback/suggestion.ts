import { Client } from '@notionhq/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { logEventInMatomo } from '#utils/analytics/matomo';
import httpClient from '#utils/network';
import logErrorInSentry from '#utils/sentry';

const notion = new Client({ auth: process.env.NOTION_API_SECRET });
const databaseId = process.env.NOTION_DATABASE_ID;

const logAllEvents = async (req: NextApiRequest) => {
  try {
    const today = new Date();

    const NA = 'Non renseigné';

    await logEventInMatomo(
      'feedback:suggestion',
      req.body['textarea'] || NA,
      `type=${req.body['radio-set-visitor-type'] || NA}&date=${
        today.toISOString().split('T')[0]
      }&uuid=${req.body['uuid']}`,
      'suggestion'
    );

    const data = {
      username: 'clippy',
      text: `Note : **${req.body['radio-set-mood']}/10** \nVisiteur : ${
        req.body['radio-set-visitor-type'] || NA
      } \nOrigine : ${
        req.body['radio-set-visitor-origin'] || NA
      } \nCommentaire : *${req.body['textarea'] || NA}*`,
    };

    await httpClient({
      url: process.env.MATTERMOST_HOOK,
      method: 'POST',
      data,
    });
  } catch (e: any) {
    logErrorInSentry('Error in form submission matomo', {
      details: e.toString(),
    });
  }
};

async function addItemToNotion(req: NextApiRequest) {
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
  addItemToNotion(req);
  res.writeHead(302, {
    Location: '/suggestion/merci',
  });
  res.end();
};

export default saveAndRedirect;
