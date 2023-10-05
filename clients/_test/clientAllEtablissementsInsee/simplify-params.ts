import { Siren } from '#utils/helpers';

export default function simplifyParams(siren: Siren, page: number) {
  return { siren, page };
}
