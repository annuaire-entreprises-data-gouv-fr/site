import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_SECRET });

const feedbacksDatabaseId = process.env.NOTION_FEEDBACKS_DATABASE_ID;

export const notionFeedbacksLink = `https://www.notion.so/apigouv/${feedbacksDatabaseId}?v=a5c2c84d69e7486d9c1c9b9ae90e9f2f&pvs=4`;

export const logSuggestionToNotion = async (
  visitorType: string,
  email: string,
  suggestion: string
) => {
  await notion.pages.create({
    parent: { database_id: feedbacksDatabaseId as string },
    properties: {
      Email: {
        title: [
          {
            text: {
              content: email,
            },
          },
        ],
      },
      Suggestion: {
        rich_text: [
          {
            text: {
              content: suggestion,
            },
          },
        ],
      },
      "Type d'utilisateur": {
        select: { name: visitorType },
      },
      Date: {
        date: { start: new Date().toISOString() },
      },
    },
  });
};

const agentsDataBaseId = process.env.NOTION_AGENTS_DATABASE_ID;

export const getAgentsFromNotion = async () => {
  const rows = await notion.databases.query({
    database_id: agentsDataBaseId as string,
  });
  return rows.results.map((r: any) => r.properties.Email.email);
};
