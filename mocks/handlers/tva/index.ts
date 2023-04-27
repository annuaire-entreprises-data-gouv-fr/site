import { rest } from 'msw';

export const handlers = [
  rest.get('https://rncs-proxy.api.gouv.fr/tva/528163777', (_req, res, ctx) => {
    return res(
      ctx.json({
        isValid: true,
        requestDate: '2023-04-06T21:14:10.956Z',
        userError: 'VALID',
        name: 'COMPANY WITH RGE CERTIFICATIONS',
        address: '5-9 5 RUE MORAND 93400 SAINT-OUEN-SUR-SEINE',
        requestIdentifier: '',
        vatNumber: '27552032534',
        viesApproximate: {
          name: '---',
          street: '---',
          postalCode: '---',
          city: '---',
          companyType: '---',
          matchName: 3,
          matchStreet: 3,
          matchPostalCode: 3,
          matchCity: 3,
          matchCompanyType: 3,
        },
      })
    );
  }),
  rest.get('https://rncs-proxy.api.gouv.fr/tva/*', (_req, res, ctx) => {
    return res(
      ctx.json({
        isValid: true,
        requestDate: '2023-04-06T21:14:10.956Z',
        userError: 'VALID',
        name: 'SA DANONE',
        address: '17 BD HAUSSMANN\n75009 PARIS',
        requestIdentifier: '',
        vatNumber: '27552032534',
        viesApproximate: {
          name: '---',
          street: '---',
          postalCode: '---',
          city: '---',
          companyType: '---',
          matchName: 3,
          matchStreet: 3,
          matchPostalCode: 3,
          matchCity: 3,
          matchCompanyType: 3,
        },
      })
    );
  }),
];
