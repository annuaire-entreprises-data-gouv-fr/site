import Image from 'next/image';
import githubLogo from '../../style/icons/logo/github-fill.svg';
import linkedinLogo from '../../style/icons/logo/linkedin-box-fill.svg';
import twitterLogo from '../../style/icons/logo/twitter-fill.svg';
import externalLink from '../../style/icons/system/external-link-line.svg';
import searchFile from '../../style/icons/system/search-line.svg';

export function PrefetchImgs() {
  return (
    <div style={{ display: 'none' }}>
      <Image src={searchFile} alt="" priority />
      <Image src={twitterLogo} alt="" priority />
      <Image src={linkedinLogo} alt="" priority />
      <Image src={githubLogo} alt="" priority />
      <Image src={externalLink} alt="" priority />
    </div>
  );
}
