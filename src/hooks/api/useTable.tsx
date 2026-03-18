import tableApiRequest from "@/apiRequests/table.api";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetTableListQuery(accessToken?: string) {
  return useQuery({
    queryKey: ["tables", accessToken],
    queryFn: async () => {
      if (!accessToken) return [];
      const response = await tableApiRequest.getList({ sort: "number.asc" });
      return response.data || [];
    },
    enabled: !!accessToken,
  });
}

export function useCreateTableMutation() {
  return useMutation({
    mutationFn: tableApiRequest.create,
  });
}

export function useUpdateTableMutation() {
  return useMutation({
    mutationFn: tableApiRequest.update,
  });
}

export function useRemoveTableMutation() {
  return useMutation({
    mutationFn: tableApiRequest.remove,
  });
}
