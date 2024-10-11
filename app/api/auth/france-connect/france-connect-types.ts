import { Exception } from '#models/exceptions';

export class FranceConnectFailedException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      name: 'FranceConnectFailedException',
      ...args,
    });
  }
}

export class FranceConnectLogoutFailedException extends Exception {
  constructor(args: { cause?: any }) {
    super({
      ...args,
      name: 'LogoutFailedException',
    });
  }
}
