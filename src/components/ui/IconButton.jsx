import { clsx } from "../../utils/clsx";

export const IconButton = ({ className, ...props }) => (
  <button className={clsx("ui-button ui-button--ghost", className)} type="button" {...props} />
);
