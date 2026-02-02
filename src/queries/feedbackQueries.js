import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export const useFeedbackItemsQuery = (filters = {}) =>
  useQuery({
    queryKey: ["feedback", filters],
    queryFn: async () => api.getFeedback(filters),
  });

export const useFeedbackItemByIdQuery = (id) =>
  useQuery({
    queryKey: ["feedback", "detail", id],
    queryFn: async () => api.getFeedbackById(id),
    enabled: Boolean(id),
  });

export const useSourceCountsQuery = () =>
  useQuery({
    queryKey: ["feedback", "sourceCounts"],
    queryFn: async () => api.getSourceCounts(),
  });

export const useTagCountsQuery = () =>
  useQuery({
    queryKey: ["feedback", "tagCounts"],
    queryFn: async () => api.getTagCounts(),
  });

export const useViewCountsQuery = () =>
  useQuery({
    queryKey: ["feedback", "viewCounts"],
    queryFn: async () => api.getViewCounts(),
  });

export const useSearchQuery = (query) =>
  useQuery({
    queryKey: ["feedback", "search", query],
    queryFn: async () => api.search(query),
    enabled: Boolean(query),
  });

export const useTriageSpeedQuery = () =>
  useQuery({
    queryKey: ["feedback", "triageSpeed"],
    queryFn: async () => api.getTriageSpeed(),
  });

export const useUpdateFeedbackMutation = (id) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload) => api.updateFeedback(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
    },
  });
};
