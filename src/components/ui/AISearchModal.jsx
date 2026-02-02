import { useState } from "react";
import { Button } from "./Button";
import { SearchInput } from "./SearchInput";
import { Skeleton } from "./Skeleton";
import { useAISearchQuery } from "../../queries/aiQueries";
import "./ui.css";

export const AISearchModal = ({ isOpen, onClose, onSelectFeedback }) => {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data, isLoading } = useAISearchQuery(searchQuery, searchQuery.length > 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query.trim());
    }
  };

  const handleSelectResult = (id) => {
    onSelectFeedback(id);
    onClose();
    setQuery("");
    setSearchQuery("");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.7)",
          zIndex: 100,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: "10vh",
        }}
        onClick={onClose}
      >
        <div
          style={{
            width: "90%",
            maxWidth: 700,
            background: "var(--color-secondary-dark)",
            borderRadius: 16,
            border: "1px solid var(--color-tertiary-dark)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-tertiary-dark)" }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
              🔍 AI-Powered Search
            </div>
            <form onSubmit={handleSearch}>
              <div style={{ display: "flex", gap: 12 }}>
                <SearchInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search feedback using natural language..."
                  style={{ flex: 1 }}
                  autoFocus
                />
                <Button type="submit" variant="primary" disabled={!query.trim()}>
                  Search
                </Button>
              </div>
            </form>
          </div>

          <div style={{ maxHeight: "60vh", overflowY: "auto", padding: 16 }}>
            {isLoading ? (
              <div style={{ display: "grid", gap: 12 }}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} style={{ height: 80 }} />
                ))}
              </div>
            ) : searchQuery && data?.results ? (
              <>
                {data.results.length > 0 ? (
                  <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ fontSize: 12, color: "var(--color-white-muted)", marginBottom: 4 }}>
                      Found {data.results.length} relevant results
                    </div>
                    {data.results.map((result) => (
                      <div
                        key={result.id}
                        onClick={() => handleSelectResult(result.id)}
                        style={{
                          padding: 16,
                          background: "var(--color-tertiary-dark)",
                          borderRadius: 10,
                          cursor: "pointer",
                          border: "1px solid transparent",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--color-blue)";
                          e.currentTarget.style.background = "rgba(130, 182, 255, 0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "transparent";
                          e.currentTarget.style.background = "var(--color-tertiary-dark)";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <div style={{ fontWeight: 600, flex: 1 }}>{result.title}</div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--color-blue)",
                              background: "rgba(130, 182, 255, 0.15)",
                              padding: "2px 8px",
                              borderRadius: 4,
                            }}
                          >
                            {Math.round(result.score * 100)}% match
                          </div>
                        </div>
                        <div style={{ fontSize: 13, color: "var(--color-white-muted)", marginBottom: 8 }}>
                          {result.snippet}
                        </div>
                        <div style={{ display: "flex", gap: 8, fontSize: 11, color: "var(--color-white-muted)" }}>
                          <span>{result.sourceLabel}</span>
                          <span>•</span>
                          <span>{result.status}</span>
                          <span>•</span>
                          <span>{result.priority}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--color-white-muted)" }}>
                    No results found for "{searchQuery}"
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--color-white-muted)" }}>
                {searchQuery ? "No search performed yet" : "Enter a search query to find relevant feedback"}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
