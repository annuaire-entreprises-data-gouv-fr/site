import { setupServer } from 'msw/node';
import {
  adameHandlers,
  cultureHandlers,
  geoHandlers,
  inseeHandlers,
  rncsHandlers,
  searchHandlers,
  banHandlers,
  tvaHandlers,
} from './handlers';

export const server = setupServer(
  ...[
    ...adameHandlers,
    ...banHandlers,
    ...cultureHandlers,
    ...geoHandlers,
    ...inseeHandlers,
    ...rncsHandlers,
    ...searchHandlers,
    ...tvaHandlers,
  ]
);
