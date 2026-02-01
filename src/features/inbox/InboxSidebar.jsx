import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CountBadge } from "../../components/ui/CountBadge";
import { useSourceCountsQuery, useTagCountsQuery, useViewCountsQuery } from "../../queries/feedbackQueries";
import { inboxSources, inboxViews } from "./inboxFilters";

export const InboxSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeView = searchParams.get("view") || "ALL";
  const activeSource = searchParams.get("source") || "";

  const { data: viewCounts } = useViewCountsQuery();
  const { data: sourceCounts } = useSourceCountsQuery();
  const { data: tagCounts } = useTagCountsQuery();

  const topTags = useMemo(() => {
    if (!tagCounts) return [];
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [tagCounts]);

  const updateParams = (next) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    });
    setSearchParams(nextParams);
  };

  return (
    <aside className="inbox-panel sidebar-panel">
      <div className="inbox-sidebar__section">
        <div className="inbox-sidebar__title">Views</div>
        {inboxViews.map((view) => (
          <div
            key={view.key}
            className={`inbox-sidebar__item ${activeView === view.key ? "active" : ""}`}
            onClick={() => updateParams({ view: view.key })}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                updateParams({ view: view.key });
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span className="inbox-sidebar__label">
              <span className="inbox-sidebar__icon" />
              {view.label}
            </span>
            <CountBadge value={viewCounts?.[view.key] ?? 0} />
          </div>
        ))}
      </div>

      <div className="inbox-sidebar__section">
        <div className="inbox-sidebar__title">Sources</div>
        {inboxSources.map((source) => (
          <div
            key={source.key}
            className={`inbox-sidebar__item ${activeSource === source.key ? "active" : ""}`}
            onClick={() => updateParams({ source: source.key })}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                updateParams({ source: source.key });
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span className="inbox-sidebar__label">
              <span className="inbox-sidebar__icon" style={{ background: "var(--color-orange)" }} />
              {source.label}
            </span>
            <CountBadge value={sourceCounts?.[source.key] ?? 0} />
          </div>
        ))}
      </div>

      {topTags.length > 0 && (
        <div className="inbox-sidebar__section">
          <div className="inbox-sidebar__title">Tags</div>
          {topTags.map(([tag, count]) => (
            <div
              key={tag}
              className={`inbox-sidebar__item ${
                searchParams.get("tag") === tag ? "active" : ""
              }`}
              onClick={() => updateParams({ tag })}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  updateParams({ tag });
                }
              }}
              role="button"
              tabIndex={0}
            >
              <span className="inbox-sidebar__label">
                <span className="inbox-sidebar__icon" style={{ background: "var(--color-blue)" }} />
                {tag}
              </span>
              <CountBadge value={count} />
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};
