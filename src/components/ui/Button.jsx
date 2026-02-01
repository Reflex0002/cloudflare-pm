import { clsx } from "../../utils/clsx";

const variantClass = {
  primary: "ui-button--primary",
  secondary: "ui-button--secondary",
  ghost: "ui-button--ghost",
};

export const Button = ({ variant = "secondary", className, ...props }) => (
  <button
    className={clsx("ui-button", variantClass[variant], className)}
    type="button"
    {...props}
  />
);
