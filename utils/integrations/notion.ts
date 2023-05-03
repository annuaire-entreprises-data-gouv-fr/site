import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_SECRET });
export const notionDatabaseId = process.env.NOTION_DATABASE_ID;

export default async function logSuggestionToNotion(
  visitorType: string,
  email: string,
  suggestion: string
) {
  await notion.pages.create({
    parent: { database_id: notionDatabaseId as string },
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
}
