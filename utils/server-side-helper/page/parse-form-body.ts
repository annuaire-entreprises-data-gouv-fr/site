import { promisify } from 'util';
import bodyParser from 'body-parser';
import { GetServerSidePropsContext } from 'next';

const parseFormBody = promisify(
  bodyParser.urlencoded({
    extended: true,
  })
);
/**
 *
 * @param context
 * @param getServerSidePropsFunction
 */
export default async function parseFormBodyMiddleware(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsContext> {
  if (context && context.req && context.req.method === 'POST') {
    await parseFormBody(context.req, context.res);
  }
  return context;
}
