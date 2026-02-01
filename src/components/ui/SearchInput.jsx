import { clsx } from "../../utils/clsx";

export const SearchInput = ({ className, ...props }) => (
  <label className={clsx("ui-search", className)}>
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-2a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm7.707 2.293-4.086-4.086 1.414-1.414 4.086 4.086-1.414 1.414Z"
        fill="currentColor"
      />
    </svg>
    <input type="search" placeholder="Search" aria-label="Search" {...props} />
  </label>
);
