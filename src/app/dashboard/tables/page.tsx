import tableApiRequest from "@/apiRequests/table.api";
import { TablesTable } from "@/app/dashboard/tables/tables-table";
import { getAuthSession } from "@/auth";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Role } from "@/constants/enum";
import { ROUTES } from "@/constants/constants";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await getAuthSession();
  const promise = tableApiRequest.getList(session?.accessToken || "");

  if (session?.account?.role !== Role.Manager) {
    redirect(ROUTES.DASHBOARD.ROOT);
  }

  return (
    <div className="p-8">
      <div className="mb-3 flex items-start justify-between">
        <h2 className="text-2xl font-semibold">Quản lý bàn ăn</h2>
      </div>
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={1}
            cellWidths={["8rem", "8rem", "8rem", "8rem", "8rem", "8rem"]}
            shrinkZero
          />
        }
      >
        <TablesTable promise={promise} />
      </React.Suspense>
    </div>
  );
}
