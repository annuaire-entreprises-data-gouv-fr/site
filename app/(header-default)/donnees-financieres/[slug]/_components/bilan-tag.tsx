import NonRenseigne from "#components/non-renseigne";
import { Tag } from "#components-ui/tag";

export const BilanTypeTag = ({ type }: { type: string }) => (
  <>
    {type === "K" ? (
      <Tag color="info">consolidé</Tag>
    ) : type === "C" ? (
      <Tag color="info">complet</Tag>
    ) : type === "S" ? (
      <Tag color="info">simplifié</Tag>
    ) : (
      <NonRenseigne />
    )}
  </>
);
