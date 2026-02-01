import { clsx } from "../../utils/clsx";

export const Card = ({ className, ...props }) => (
  <div className={clsx("ui-card", className)} {...props} />
);
