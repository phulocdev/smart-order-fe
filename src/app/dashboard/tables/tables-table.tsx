"use client";

import DeleteTableDialog from "@/app/dashboard/tables/delete-table-dialog";
import { getColumns } from "@/app/dashboard/tables/tables-table-columns";
import UpsertTableDialog from "@/app/dashboard/tables/upsert-table-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { PAGINATION } from "@/constants/constants";
import { translateTableKey } from "@/lib/utils";
import { ITable } from "@/types/backend.type";
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

interface TablesTableProps {
  promise: Promise<PaginatedResponse<ITable>>;
}

export function TablesTable({ promise }: TablesTableProps) {
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
    React.useState<DataTableRowAction<ITable> | null>(null);
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const isUpdating = rowAction?.type === "update";
  const { data: tableListData } = React.use(promise);
  const columns = React.useMemo(() => getColumns({ setRowAction }), []);

  const filterFields: DataTableFilterField<ITable>[] = [
    {
      id: "number",
      label: "Số bàn",
      placeholder: "Lọc theo số bàn",
    },
    {
      id: "status",
      label: "Trạng thái",
      placeholder: "Lọc theo trạng thái",
    },
  ];

  const table = useReactTable({
    data: tableListData,
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
            Thêm bàn ăn
          </Button>
        </div>
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          translateHeaderFunc={translateTableKey as any}
        ></DataTableToolbar>
      </DataTable>
      <UpsertTableDialog
        open={isCreating || isUpdating}
        table={rowAction?.row.original}
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
      <DeleteTableDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        table={rowAction?.row.original}
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
