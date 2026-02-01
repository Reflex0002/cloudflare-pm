import { clsx } from "../../utils/clsx";

export const Badge = ({ className, ...props }) => (
  <span className={clsx("ui-badge", className)} {...props} />
);
