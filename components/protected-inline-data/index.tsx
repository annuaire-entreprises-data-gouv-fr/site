import type { PropsWithChildren } from "react";
import { Icon } from "#components-ui/icon/wrapper";
import constants from "#models/constants";

export const ProtectedInlineData: React.FC<PropsWithChildren> = ({
  children,
}) => (
  <div
    style={{
      borderRadius: "30px",
      border: `2px solid ${constants.colors.espaceAgentPastel}`,
      paddingLeft: "8px",
      paddingRight: "10px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <Icon color={constants.colors.espaceAgent} slug="lockFill">
      {children}
    </Icon>
  </div>
);
