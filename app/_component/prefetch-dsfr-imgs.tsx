import Image from "next/image";
import githubLogo from "../../style/icons/logo/github-fill.svg";
import linkedinLogo from "../../style/icons/logo/linkedin-box-fill.svg";
import externalLink from "../../style/icons/system/external-link-line.svg";
import searchFile from "../../style/icons/system/search-line.svg";

export function PrefetchImgs() {
  return (
    <div style={{ display: "none" }}>
      <Image alt="" priority src={searchFile} />
      <Image alt="" priority src={linkedinLogo} />
      <Image alt="" priority src={githubLogo} />
      <Image alt="" priority src={externalLink} />
    </div>
  );
}
