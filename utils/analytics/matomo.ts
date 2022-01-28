/**
 * BE CAREFUL, this is server-side analytics only !
 */

//@ts-ignore
import MatomoTracker from 'matomo-tracker';

let matomo: any = null;

// Initialize with your site ID and Matomo URL
const init = () => {
  // if (process.env.NODE_ENV === 'production' && process.env.MATOMO_SITE_ID) {
  if (true) {
    matomo = new MatomoTracker(
      // process.env.MATOMO_SITE_ID,
      145,
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
      if (!matomo) {
        init();
      }

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
          reject();
        }
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
};
