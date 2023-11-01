import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_SECRET });

const agentsDataBaseId = process.env.NOTION_AGENTS_DATABASE_ID;

export const getSuperAgentsFromNotion = async () => {
  const rows = await notion.databases.query({
    database_id: agentsDataBaseId as string,
  });
  const authorizedAgents = rows.results
    .filter((r: any) => r.properties.Actif.checkbox === true)
    .map((r: any) => r.properties.Email.email);
  return authorizedAgents;
};
