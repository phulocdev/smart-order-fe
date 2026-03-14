import http from "@/lib/http";
import { ITable } from "@/types/backend.type";
import { ApiResponse, PaginatedResponse } from "@/types/response.type";

const tableApiRequest = {
  getList: () => {
    return http.get<PaginatedResponse<ITable>>("/tables", {});
  },

  clientGetOne: (id: string) => {
    return http.get<ApiResponse<ITable>>(`/tables/${id}`);
  },
  create: (body: Partial<ITable>) => {
    return http.post("/tables", body);
  },
  update: ({ id, body }: { id: string; body: Partial<ITable> }) => {
    return http.patch(`/tables/${id}`, body);
  },
  remove: (id: string) => {
    return http.delete(`/tables/${id}`);
  },
};

export default tableApiRequest;
