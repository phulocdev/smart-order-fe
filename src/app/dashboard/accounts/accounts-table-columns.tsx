import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Role } from "@/constants/enum";
import { IAccount } from "@/types/auth.type";
import type { DataTableRowAction } from "@/types/data-table.type";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { SquarePen, Trash } from "lucide-react";
import * as React from "react";

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<IAccount> | null>
  >;
}

export function getColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<IAccount>[] {
  return [
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Email"} />
      ),
      cell: ({ row }) => <div>{row.original.email}</div>,
      size: 200,
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Tên đầy đủ"} />
      ),
      cell: ({ row }) => <div>{row.original.fullName}</div>,
      size: 200,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Vai trò"} />
      ),
      cell: ({ row }) => <Badge>{Role[row.original.role]}</Badge>,
      size: 100,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Ngày tạo"} />
      ),
      cell: ({ row }) => (
        <>
          <div>
            <span className="text-xs text-gray-500">Ngày: </span>
            <span className="text-sm">
              {row.original.createdAt
                ? format(new Date(row.original.createdAt), "dd/MM/yyyy")
                : ""}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-500">Giờ: </span>
            <span className="text-sm">
              {row.original.createdAt
                ? format(new Date(row.original.createdAt), "H:mm:ss")
                : ""}
            </span>
          </div>
        </>
      ),
      size: 120,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: function Cell({ row }) {
        return (
          <div className="flex items-center gap-x-2">
            <Button
              onClick={() => setRowAction({ row, type: "update" })}
              aria-label="Open menu"
              variant="ghost"
              className="flex size-8 p-0 data-[state=open]:bg-muted"
            >
              <SquarePen className="h-3 w-3" aria-hidden="true" />
            </Button>
            <Button
              size={"icon"}
              type="button"
              variant={"ghost"}
              onClick={() => {
                setRowAction({ row, type: "delete" });
              }}
            >
              <Trash />
            </Button>
          </div>
        );
      },
      size: 80,
    },
  ];
}
