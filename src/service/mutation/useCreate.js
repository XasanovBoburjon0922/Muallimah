import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../config/request";

export const useCreate = (endpoint, queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => request.post(endpoint, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.error("Yaratishda xato yuz berdi:", error);
    },
  });
};
