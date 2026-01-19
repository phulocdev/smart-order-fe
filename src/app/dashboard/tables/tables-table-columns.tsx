import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getVietnameseTableStatus, translateTableKey } from "@/lib/utils";
import { ITable } from "@/types/backend.type";
import type { DataTableRowAction } from "@/types/data-table.type";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { SquarePen, Trash } from "lucide-react";
import * as React from "react";
import QRCode from "react-qr-code";

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<ITable> | null>
  >;
}

export function getColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<ITable>[] {
  return [
    {
      accessorKey: "number",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translateTableKey("number")}
        />
      ),
      cell: ({ row }) => <div>{row.original.number}</div>,
      size: 100,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translateTableKey("status")}
        />
      ),
      cell: ({ row }) => (
        <Badge>{getVietnameseTableStatus(row.original.status)}</Badge>
      ),
      size: 120,
    },
    {
      accessorKey: "reservationLink",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã QR đặt chỗ" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col items-center">
          <QRCode value={row.original.reservationLink} size={120} />
        </div>
      ),
      size: 160,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={translateTableKey("createdAt")}
        />
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
