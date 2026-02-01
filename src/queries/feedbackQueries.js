import { useQuery } from "@tanstack/react-query";
import { mockFeedback } from "../data/mockFeedback";

const simulateFetch = (data, delay = 180) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });

const matchesSearch = (item, search) => {
  if (!search) return true;
  const text = [
    item.title,
    item.snippet,
    item.body,
    item.authorName,
    item.authorHandle,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return text.includes(search.toLowerCase());
};

const applyFilters = (items, filters = {}) => {
  const { sourceType, status, priority, type, tag, search } = filters;
  return items.filter((item) => {
    if (sourceType && item.sourceType !== sourceType) return false;
    if (status && item.status !== status) return false;
    if (priority && item.priority !== priority) return false;
    if (type && item.type !== type) return false;
    if (tag && !item.tags.includes(tag)) return false;
    if (!matchesSearch(item, search)) return false;
    return true;
  });
};

const applyViewFilter = (items, view) => {
  switch (view) {
    case "NEEDS_TRIAGE":
      return items.filter((item) => item.status === "NEW");
    case "HIGH_IMPACT":
      return items.filter((item) => item.priority === "P0" || item.priority === "P1");
    case "BUGS":
      return items.filter((item) => item.type === "BUG");
    case "FEATURES":
      return items.filter((item) => item.type === "FEATURE");
    case "UX_PAIN":
      return items.filter((item) => item.tags.includes("ux") || item.tags.includes("usability"));
    default:
      return items;
  }
};

export const useFeedbackItemsQuery = (filters = {}) =>
  useQuery({
    queryKey: ["feedback", filters],
    queryFn: async () => {
      const filtered = applyViewFilter(applyFilters(mockFeedback, filters), filters.view);
      return simulateFetch(filtered);
    },
  });

export const useFeedbackItemByIdQuery = (id) =>
  useQuery({
    queryKey: ["feedback", "detail", id],
    queryFn: async () => simulateFetch(mockFeedback.find((item) => item.id === id)),
    enabled: Boolean(id),
  });

export const useSourceCountsQuery = () =>
  useQuery({
    queryKey: ["feedback", "sourceCounts"],
    queryFn: async () => {
      const counts = mockFeedback.reduce((acc, item) => {
        acc[item.sourceType] = (acc[item.sourceType] || 0) + 1;
        return acc;
      }, {});
      return simulateFetch(counts);
    },
  });

export const useTagCountsQuery = () =>
  useQuery({
    queryKey: ["feedback", "tagCounts"],
    queryFn: async () => {
      const counts = mockFeedback.reduce((acc, item) => {
        item.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {});
      return simulateFetch(counts);
    },
  });

export const useViewCountsQuery = () =>
  useQuery({
    queryKey: ["feedback", "viewCounts"],
    queryFn: async () => {
      const all = mockFeedback.length;
      const needsTriage = mockFeedback.filter((item) => item.status === "NEW").length;
      const highImpact = mockFeedback.filter(
        (item) => item.priority === "P0" || item.priority === "P1"
      ).length;
      const bugs = mockFeedback.filter((item) => item.type === "BUG").length;
      const features = mockFeedback.filter((item) => item.type === "FEATURE").length;
      const uxPain = mockFeedback.filter(
        (item) => item.tags.includes("ux") || item.tags.includes("usability")
      ).length;

      return simulateFetch({
        ALL: all,
        NEEDS_TRIAGE: needsTriage,
        HIGH_IMPACT: highImpact,
        BUGS: bugs,
        FEATURES: features,
        UX_PAIN: uxPain,
      });
    },
  });
