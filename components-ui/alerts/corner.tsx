import type React from "react";
import type { PropsWithChildren } from "react";
import type { IIconsSlug } from "#components-ui/icon";
import { Icon } from "#components-ui/icon/wrapper";
import { colors } from ".";
import styles from "./styles.module.css";

const CornerAlert: React.FC<
  PropsWithChildren<{
    color1: string;
    color2: string;
    icon: IIconsSlug;
    onDismiss: () => void;
  }>
> = ({ color1, color2, icon, children, onDismiss }) => (
  <div
    className={styles["corner-banner"]}
    style={{
      borderLeft: `4px solid ${color1}`,
      backgroundColor: color2,
    }}
  >
    <div>
      <Icon color={color1} size={20} slug={icon} />
    </div>
    <div>{children}</div>
    <button
      aria-label="Fermer la notification"
      className={styles.close}
      onClick={onDismiss}
    >
      ✕
    </button>
  </div>
);

export const CornerBannerSuccess: React.FC<
  PropsWithChildren<{ onDismiss: () => void }>
> = ({ children, onDismiss }) => (
  <CornerAlert
    color1={colors.success[0]}
    color2={colors.success[1]}
    icon="successFill"
    onDismiss={onDismiss}
  >
    {children}
  </CornerAlert>
);

export const CornerBannerWarning: React.FC<
  PropsWithChildren<{ onDismiss: () => void }>
> = ({ children, onDismiss }) => (
  <CornerAlert
    color1={colors.warning[0]}
    color2={colors.warning[1]}
    icon="alertFill"
    onDismiss={onDismiss}
  >
    {children}
  </CornerAlert>
);

export const CornerBannerError: React.FC<
  PropsWithChildren<{ onDismiss: () => void }>
> = ({ children, onDismiss }) => (
  <CornerAlert
    color1={colors.error[0]}
    color2={colors.error[1]}
    icon="errorFill"
    onDismiss={onDismiss}
  >
    {children}
  </CornerAlert>
);

export const CornerBannerInfo: React.FC<
  PropsWithChildren<{ onDismiss: () => void }>
> = ({ children, onDismiss }) => (
  <CornerAlert
    color1={colors.info[0]}
    color2={colors.info[1]}
    icon="information"
    onDismiss={onDismiss}
  >
    {children}
  </CornerAlert>
);
