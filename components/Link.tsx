import { type LinkProps, default as NextLink } from "next/link";

export function Link({
  prefetch,
  ...rest
}: LinkProps & { children: React.ReactNode }) {
  return <NextLink prefetch={false} {...rest} />;
}
