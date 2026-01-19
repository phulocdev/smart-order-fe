import http from "@/lib/http";
import { IAccount } from "@/types/auth.type";
import { PaginatedResponse } from "@/types/response.type";
import qs from "qs";

const prefix = "/accounts";

const accountApiRequest = {
  getList: (accessToken: string, params?: Record<string, string>) => {
    return http.get<PaginatedResponse<IAccount>>(
      `${prefix}?${qs.stringify(params)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  },
  create: (body: Partial<IAccount>) => {
    return http.post(prefix, body);
  },
  update: ({ id, body }: { id: string; body: Partial<IAccount> }) => {
    return http.patch(`${prefix}/${id}`, body);
  },
  remove: (id: string) => {
    return http.delete(`${prefix}/${id}`);
  },
  changePassword: (body: { currentPassword: string; newPassword: string }) => {
    return http.patch("/auth/change-password", body);
  },
  updateProfile: (body: { name?: string; avatarUrl?: string }) => {
    return http.patch("/auth/profile", body);
  },
};

export default accountApiRequest;
