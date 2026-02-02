import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Dropdown } from "../../components/ui/Dropdown";
import { SearchInput } from "../../components/ui/SearchInput";
import { Skeleton } from "../../components/ui/Skeleton";
import { useFeedbackItemsQuery } from "../../queries/feedbackQueries";
import { FeedbackTable } from "./FeedbackTable";

const statusOptions = ["", "NEW", "TRIAGED", "IN_PROGRESS", "CLOSED"];
const priorityOptions = ["", "P0", "P1", "P2", "P3"];
const typeOptions = ["", "BUG", "FEATURE", "QUESTION", "PRAISE"];

export const FeedbackTablePanel = ({ selectedId, onSelect }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = useMemo(
    () => ({
      view: searchParams.get("view") || "ALL",
      sourceType: searchParams.get("source") || "",
      tag: searchParams.get("tag") || "",
      status: searchParams.get("status") || "",
      priority: searchParams.get("priority") || "",
      type: searchParams.get("type") || "",
      search: searchParams.get("search") || "",
    }),
    [searchParams]
  );

  const { data, isLoading } = useFeedbackItemsQuery(filters);
  const items = data?.items ?? [];

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams);
  };

  return (
    <section className="inbox-panel">
      <div className="inbox-toolbar">
        <div className="inbox-toolbar__group">
          <SearchInput
            placeholder="Search within view"
            value={filters.search}
            onChange={(event) => updateParam("search", event.target.value)}
          />
          <Button variant="secondary" onClick={() => setFiltersOpen((open) => !open)}>
            {filtersOpen ? "Hide filters" : "Filters"}
          </Button>
        </div>
        <div className="inbox-toolbar__group">
          <Dropdown onChange={(event) => updateParam("sortBy", event.target.value)}>
            <option value="">Sort: Recent</option>
            <option value="createdAt">Created</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="sourceType">Source</option>
          </Dropdown>
        </div>
      </div>

      {filtersOpen && (
        <div className="filter-bar">
          <label>
            <div style={{ marginBottom: 6, color: "var(--color-white-muted)" }}>Status</div>
            <Dropdown value={filters.status} onChange={(e) => updateParam("status", e.target.value)}>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option || "Any"}
                </option>
              ))}
            </Dropdown>
          </label>
          <label>
            <div style={{ marginBottom: 6, color: "var(--color-white-muted)" }}>Priority</div>
            <Dropdown
              value={filters.priority}
              onChange={(e) => updateParam("priority", e.target.value)}
            >
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option || "Any"}
                </option>
              ))}
            </Dropdown>
          </label>
          <label>
            <div style={{ marginBottom: 6, color: "var(--color-white-muted)" }}>Type</div>
            <Dropdown value={filters.type} onChange={(e) => updateParam("type", e.target.value)}>
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option || "Any"}
                </option>
              ))}
            </Dropdown>
          </label>
        </div>
      )}

      {isLoading ? (
        <div style={{ display: "grid", gap: 10 }}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} style={{ height: 48 }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div style={{ color: "var(--color-white-muted)" }}>
          No feedback items match the current filters.
        </div>
      ) : (
        <FeedbackTable data={items} selectedId={selectedId} onSelect={onSelect} />
      )}

    </section>
  );
};
