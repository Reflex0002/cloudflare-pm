import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export const useAttachmentsQuery = (feedbackId) => {
  return useQuery({
    queryKey: ["attachments", feedbackId],
    queryFn: () => api.getAttachments(feedbackId),
    enabled: !!feedbackId,
  });
};

export const useUploadAttachment = (feedbackId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file) => api.uploadAttachment(feedbackId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", feedbackId] });
    },
  });
};

export const useDeleteAttachment = (feedbackId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (attachmentId) => api.deleteAttachment(attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", feedbackId] });
    },
  });
};
