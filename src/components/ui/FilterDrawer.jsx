import { Button } from "./Button";

export const FilterDrawer = ({ isOpen, title = "Filters", onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="ui-filter-drawer" role="dialog" aria-label={title}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <strong>{title}</strong>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
};
