"use client";

import { getColumns } from "@/app/dashboard/accounts/accounts-table-columns";
import { DeleteAccountDialog } from "@/app/dashboard/accounts/delete-account-dialog";
import UpsertAccountDialog from "@/app/dashboard/accounts/upsert-account-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { PAGINATION } from "@/constants/constants";
import { IAccount } from "@/types/auth.type";
import {
  DataTableFilterField,
  DataTableRowAction,
} from "@/types/data-table.type";
import { PaginatedResponse } from "@/types/response.type";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

interface AccountsTableProps {
  promise: Promise<PaginatedResponse<IAccount>>;
}

export function AccountsTable({ promise }: AccountsTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      updatedAt: false,
      createdAt: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<IAccount> | null>(null);
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const isUpdating = rowAction?.type === "update";
  const { data: accountListData } = React.use(promise);
  const columns = React.useMemo(() => getColumns({ setRowAction }), []);

  const filterFields: DataTableFilterField<IAccount>[] = [
    {
      id: "email",
      label: "Email",
      placeholder: "Lọc theo email",
    },
    {
      id: "fullName",
      label: "Tên đầy đủ",
      placeholder: "Lọc theo tên đầy đủ",
    },
  ];

  const table = useReactTable({
    data: accountListData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageIndex: PAGINATION.DEFAUT_PAGE_INDEX - 1,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
      },
      columnPinning: { right: ["actions"] },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <DataTable
        table={table}
        tableDivClassName="max-h-[65vh] overflow-y-scroll custom-scrollbar rounded-sm"
      >
        <div className="flex justify-end">
          <Button onClick={() => setIsCreating(true)}>
            <CirclePlus />
            Thêm tài khoản
          </Button>
        </div>
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          translateHeaderFunc={(key) => String(key)}
        ></DataTableToolbar>
      </DataTable>
      <UpsertAccountDialog
        open={isCreating || isUpdating}
        account={rowAction?.row.original}
        type={isUpdating ? "update" : "create"}
        onSuccess={() => {
          if (isCreating) setIsCreating(false);
          if (isUpdating) setRowAction(null);
          router.refresh();
        }}
        onOpenChange={() => {
          if (isCreating) setIsCreating(false);
          if (isUpdating) setRowAction(null);
        }}
      />
      <DeleteAccountDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        account={rowAction?.row.original}
        showTrigger={false}
        onSuccess={() => {
          rowAction?.row.toggleSelected(false);
          setRowAction(null);
          router.refresh();
        }}
      />
    </>
  );
}
