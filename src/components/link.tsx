import {
  Link as TanStackLink,
  type LinkProps as TanStackLinkProps,
} from "@tanstack/react-router";
import type { AnchorHTMLAttributes } from "react";

export type LinkProps = TanStackLinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof TanStackLinkProps>;

export function Link(props: LinkProps) {
  return <TanStackLink {...props} />;
}
