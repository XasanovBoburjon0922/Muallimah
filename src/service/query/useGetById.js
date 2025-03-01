import { useQuery } from "@tanstack/react-query";
import { request } from "../../config/request";

export const useGetById = (endpoint, id) => {
  return useQuery({
    queryKey: [endpoint, id],
    queryFn: async () => {
      const response = await request.get(`${endpoint}${id}`);
      return response.data;
    },
    enabled: !!id,
    onError: (error) => {
      console.error(`Error fetching data from ${endpoint}:`, error);
    },
  });
};
