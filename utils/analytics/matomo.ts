/**
 * BE CAREFUL, this is server-side analytics only !
 */

//@ts-ignore
import MatomoTracker from 'matomo-tracker';

let matomo: any = null;

// Initialize with your site ID and Matomo URL
const init = () => {
  if (!matomo) {
    matomo = new MatomoTracker(
      process.env.MATOMO_SITE_ID,
      'https://stats.data.gouv.fr/piwik.php'
    );
  }
};

/**
 * Log on event on Matomo - Server side use only
 * @param category
 * @param action
 * @param name
 * @param value (does not appear in matomo interface)
 * @returns
 */
export const logEventInMatomo = (
  category: string,
  action: string,
  name: string,
  value: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if (
        process.env.NODE_ENV !== 'production' ||
        !process.env.MATOMO_SITE_ID
      ) {
        reject(
          'Provide a Site ID and run in production in order to log an event'
        );
      }

      // initialize matomo client if necessary
      init();

      var events = [
        {
          // use a constant unique ID to avoid messing up unique visitor count
          _id: 'AA814767-7B1F-5C81-8F1D-8E47AD7D2982',
          cdt: new Date().toISOString(),
          e_a: action,
          e_c: category,
          e_n: name,
          e_v: value,
        },
      ];

      matomo.trackBulk(events, (data: { status: string }) => {
        if (data.status !== 'success') {
          reject('Failed to log event in matomo');
        }
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
};
