import { clsx } from "../../utils/clsx";

export const Dropdown = ({ className, ...props }) => (
  <select className={clsx("ui-dropdown", className)} {...props} />
);
