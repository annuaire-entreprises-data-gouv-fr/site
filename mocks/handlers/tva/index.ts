import { rest } from 'msw';

export const handlers = [
  rest.get(
    'https://ec.europa.eu/taxation_customs/vies/rest-api/ms/FR/vat/29528163777',
    (_req, res, ctx) => {
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
    }
  ),
];
