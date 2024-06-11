'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import styles from './styles.module.css';
type IProps = {
  label: string;
  href: string;
  noFollow?: boolean;
  width?: string;
  active: boolean;
};
export default function TabLink({
  active,
  href,
  label,
  noFollow,
  width,
}: IProps) {
  useEffect(() => {
    active === false && window.dispatchEvent(new Event('cancelloadbar'));
  }, [active]);
  useEffect(() => {
    window.dispatchEvent(new Event('cancelloadbar'));
  }, []);
  return (
    <Link
      className={`${active ? styles.activeLink : ''} no-style-link`}
      href={href}
      rel={noFollow ? 'nofollow' : ''}
      style={{ width }}
      scroll={false}
      onClick={() =>
        active ? null : window.dispatchEvent(new Event('runloadbar'))
      }
      prefetch={false}
    >
      {active ? label : <h2>{label}</h2>}
    </Link>
  );
}
