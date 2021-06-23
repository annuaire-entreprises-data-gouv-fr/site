// import { readFileSync } from 'fs';
// import { extractIMRFromXml } from './IMRParser';

// describe('The CNAF XML parser', () => {
//   it('parses the XML', () => {
//     const okXML = readFileSync(
//       __dirname + '/__tests__/resources/ok.txt',
//       'utf-8'
//     );

//     const result = extractIMRFromXml(okXML);

//     expect(result).toEqual({
//       adresse: {
//         codePostalVille: '75002 PARIS',
//         identite: 'Madame JEANNE CROUTE',
//         numeroRue: '23 RUE DES ROSIERS',
//         pays: 'FRANCE',
//       },
//       allocataires: [
//         {
//           dateDeNaissance: new Date('03-05-1988'),
//           nomPrenom: 'JEANNE CROUTE',
//           sexe: 'F',
//         },
//         {
//           dateDeNaissance: new Date('05-03-1989'),
//           nomPrenom: 'JEAN CROUTE',
//           sexe: 'M',
//         },
//       ],
//       annee: 2021,
//       enfants: [
//         {
//           dateDeNaissance: new Date('03-04-2015'),
//           nomPrenom: 'MICHEL CROUTE',
//           sexe: 'M',
//         },
//         {
//           dateDeNaissance: new Date('02-11-2017'),
//           nomPrenom: 'MICHELINE CROUTE',
//           sexe: 'F',
//         },
//       ],
//       mois: 5,
//       quotientFamilial: 2057,
//     });
//   });

//   it('returns domain error when xml is invalid', () => {
//     expect(() => parser.parse('yolo<')).toThrowError(InvalidFormatError);
//   });

//   it('returns CNAF error if webservice provides a non-null error code', () => {
//     const koXML = readFileSync(
//       __dirname + '/__tests__/resources/ko.txt',
//       'utf-8'
//     );
//     expect(() => parser.parse(koXML)).toThrowError(CNAFError);
//   });
// });
