import { clsx } from "../../utils/clsx";

export const Skeleton = ({ className, style }) => (
  <div className={clsx("ui-skeleton", className)} style={style} />
);
