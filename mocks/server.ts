import { setupServer } from 'msw/node';
import {
  adameHandlers,
  geoHandlers,
  inseeHandlers,
  searchHandlers,
} from './handlers';

export const server = setupServer(
  ...[...adameHandlers, ...geoHandlers, ...inseeHandlers, ...searchHandlers]
);
