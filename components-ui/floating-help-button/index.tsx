import { clsx } from "clsx";
import { PrintNever } from "#components-ui/print-visibility";
import styles from "./style.module.css";

export default function FloatingHelpButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrintNever>
      <div className={clsx(styles.questionBottomRight, "layout-center")}>
        {children}
      </div>
    </PrintNever>
  );
}
