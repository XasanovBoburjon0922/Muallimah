import { useQuery } from "@tanstack/react-query";
import { request } from "../../config/request";

export const useGetList = (endpoint, params = {}) => {
  return useQuery({
    queryKey: [endpoint, params],
    queryFn: async () => {
      const response = await request.get(endpoint, { params });
      return response.data;
    },
    onError: (error) => {
      console.error("Error fetching data:", error);
    },
  });
};
