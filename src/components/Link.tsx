import {
  Link as TanStackLink,
  type LinkProps as TanStackLinkProps,
} from "@tanstack/react-router";
import type { AnchorHTMLAttributes } from "react";

type Props = TanStackLinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof TanStackLinkProps>;

export function Link(props: Props) {
  return <TanStackLink {...props} />;
}
