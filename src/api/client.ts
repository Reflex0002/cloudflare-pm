const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8787";

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const request = async (path, options) => {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Request failed");
  }
  return response.json();
};

export const api = {
  getFeedback: (filters) => request(`/api/feedback${buildQuery(filters)}`),
  getFeedbackById: (id) => request(`/api/feedback/${id}`),
  updateFeedback: (id, payload) =>
    request(`/api/feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  getSourceCounts: () => request("/api/analytics/sources"),
  getTagCounts: () => request("/api/analytics/tags"),
  getViewCounts: () => request("/api/analytics/views"),
  getTriageSpeed: () => request("/api/analytics/triage-speed"),
  search: (query) => request(`/api/search${buildQuery({ q: query })}`),
  getSourceItems: (sourceType, filters) =>
    request(`/api/sources/${sourceType}${buildQuery(filters)}`),
};
