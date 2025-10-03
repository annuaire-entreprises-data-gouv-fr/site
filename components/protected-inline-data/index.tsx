import { Icon } from "#components-ui/icon/wrapper";
import constants from "#models/constants";
import { PropsWithChildren } from "react";

export const ProtectedInlineData: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
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
      <Icon slug="lockFill" color={constants.colors.espaceAgent}>
        {children}
      </Icon>
    </div>
  );
};
