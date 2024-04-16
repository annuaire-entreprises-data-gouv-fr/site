import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { errorRedirection } from '../redirection';
import extractParamsAppRouter, { AppRouterProps } from './extract-params';

async function renderPage<T>(
  fn: (props: AppRouterProps) => Promise<T> | T,
  props: AppRouterProps
) {
  try {
    return {
      render: await fn(props),
      redirection: null,
    };
  } catch (error) {
    const { slug } = extractParamsAppRouter(props);

    const headerList = headers();
    const referrer = headerList.get('referer') || '';

    return {
      render: null,
      redirection: errorRedirection(error, { slug, referrer }, false),
    };
  }
}

function withErrorHandler<T>(fn: (props: AppRouterProps) => Promise<T> | T) {
  return async (props: AppRouterProps) => {
    const { redirection, render } = await renderPage(fn, props);
    if (redirection) {
      redirect(redirection.destination);
    } else {
      return render;
    }
  };
}

export default withErrorHandler;
