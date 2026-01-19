import tableApiRequest from "@/apiRequests/table.api";
import { useMutation } from "@tanstack/react-query";

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
