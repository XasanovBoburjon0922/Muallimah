import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../config/request";

export const useUpdateById = (endpoint, queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updatedData }) =>
      request.put(`${endpoint}/${id}`, updatedData).then((res) => res.data),
    onSuccess: (res) => {
      console.log(`${queryKey} muvaffaqiyatli yangilandi:`, res);
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.error(`${queryKey} yangilashda xato:`, error);
    },
  });
};
