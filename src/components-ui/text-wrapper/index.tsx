import type React from "react";
import type { PropsWithChildren } from "react";

const TextWrapper: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="fr-col-lg-8 fr-col-xl-8" style={{ marginLeft: "0" }}>
    {children}
  </div>
);

export default TextWrapper;
