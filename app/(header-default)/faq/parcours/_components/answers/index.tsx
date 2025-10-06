import type { PropsWithChildren } from "react";
import TextWrapper from "#components-ui/text-wrapper";

export const ParcoursAnswer: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => (
  <>
    <p>
      <strong>Réponse</strong>
    </p>
    <TextWrapper>
      <div
        style={{
          background: "#efefef",
          padding: "30px 20px",
          margin: "10px",
          borderRadius: "3px",
        }}
      >
        {children}
      </div>
    </TextWrapper>
  </>
);
