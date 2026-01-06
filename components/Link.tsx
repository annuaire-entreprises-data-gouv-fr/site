import { type LinkProps, default as NextLink } from "next/link";
import type { AnchorHTMLAttributes } from "react";

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

export function Link(props: Props) {
  const { prefetch, ...rest } = props;
  return <NextLink prefetch={false} {...rest} />;
}
