import { getCertificatLogoPath } from './certificats-logo';

describe('CertificatLogo works', () => {
  test('valid certificatss names', () => {
    expect(getCertificatLogoPath('qualifelec +')).toBe(
      '/images/rge/logo-rge-qualifelec.jpg'
    );
    expect(getCertificatLogoPath('qualipv')).toBe(
      '/images/rge/logo-rge-qualiPV.jpg'
    );
    expect(getCertificatLogoPath('chauffage +')).toBe(
      '/images/rge/logo-rge-chauffage.jpg'
    );
    expect(getCertificatLogoPath('habitat')).toBe(
      '/images/rge/logo-rge-NF.jpg'
    );
  });

  test('Invalids certificates names', () => {
    expect(getCertificatLogoPath('quali')).toBe('');
    expect(getCertificatLogoPath('3456')).toBe('');
    expect(getCertificatLogoPath('chauffage+')).toBe('');
  });
});

export {};
