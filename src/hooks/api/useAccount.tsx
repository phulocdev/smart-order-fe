import accountApiRequest from "@/apiRequests/account.api";
import { useMutation } from "@tanstack/react-query";

export function useCreateAccountMutation() {
  return useMutation({
    mutationFn: accountApiRequest.create,
  });
}

export function useUpdateAccountMutation() {
  return useMutation({
    mutationFn: accountApiRequest.update,
  });
}

export function useRemoveAccountMutation() {
  return useMutation({
    mutationFn: accountApiRequest.remove,
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: accountApiRequest.changePassword,
  });
}

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: accountApiRequest.updateProfile,
  });
}
