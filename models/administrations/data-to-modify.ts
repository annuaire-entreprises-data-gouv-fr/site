import { slugify } from '#utils/helpers';
import { administrationsMetaData, allAPI } from '.';

const loadDataToModify = () => {
  return Object.values(administrationsMetaData)
    .flatMap(({ dataSources, contact, site, long, short }) => {
      return dataSources.flatMap((datasource) => {
        return (datasource.data || []).map(
          ({ label, form = '', targets = [] }) => {
            const slug = slugify(label);
            return {
              label: label,
              slug,
              dataSource: datasource.label,
              datagouvLink: datasource.datagouvLink,
              apiSlug: datasource.apiSlug,
              targets,
              form,
              contact,
              site,
              long,
              short,
            };
          }
        );
      });
    })
    .filter((d) => {
      const api = allAPI[d.apiSlug];
      return !api?.isProtected;
    });
};

/**
 * List the different data that can be modified by users - useful in FAQ
 * @param slug
 * @returns
 */
export const getDataToModify = (slug: string) => {
  return allDataToModify.find((data) => data.slug === slug);
};

export const allDataToModify = loadDataToModify();
