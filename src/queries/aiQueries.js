import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export const useAISearchQuery = (query, enabled = true) =>
  useQuery({
    queryKey: ["ai-search", query],
    queryFn: async () => api.aiSearch(query),
    enabled: Boolean(query) && enabled,
  });

export const useGenerateSummaryQuery = (feedbackId, enabled = true) =>
  useQuery({
    queryKey: ["ai-summary", feedbackId],
    queryFn: async () => api.generateSummary(feedbackId),
    enabled: Boolean(feedbackId) && enabled,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

export const useIndexFeedbackMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (feedbackId) => api.indexFeedback(feedbackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-search"] });
    },
  });
};

export const useIndexAllFeedbackMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => api.indexAllFeedback(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-search"] });
    },
  });
};

export const useAnalyticsChatMutation = () => {
  return useMutation({
    mutationFn: (message) => api.analyticsChat(message),
  });
};
