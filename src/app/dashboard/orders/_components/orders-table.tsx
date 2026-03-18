"use client";

import { DeleteOrdersDialog } from "@/app/dashboard/orders/_components/delete-order-dialog";
import { OrdersTableToolbarActions } from "@/app/dashboard/orders/_components/orders-table-toolbar-actions";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Role, TableStatus } from "@/constants/enum";
import { ROUTES } from "@/constants/constants";
import { useDataTable } from "@/hooks/use-data-table";
import {
  cn,
  getVietnameseOrderStatusList,
  translateOrderKey,
} from "@/lib/utils";
import { useSocket } from "@/providers/socket-provider";
import { IOrder, ITable } from "@/types/backend.type";
import type {
  DataTableFilterField,
  DataTableRowAction,
} from "@/types/data-table.type";
import { PaginatedResponse } from "@/types/response.type";
import { Table } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { getColumns } from "./orders-table-columns";
import { useQuery } from "@tanstack/react-query";
import orderApiRequest from "@/apiRequests/order.api";
import tableApiRequest from "@/apiRequests/table.api";
import { OrderQuery } from "@/types/search-params.type";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { refresh } from "next/cache";

interface OrdersTableProps {
  params: OrderQuery;
  session: Session | null;
}

export function OrdersTable({ params, session }: OrdersTableProps) {
  const socket = useSocket();
  const router = useRouter();
  const role = session?.account?.role;
  const accessToken = session?.accessToken ?? "";

  const [debouncedParams, setDebouncedParams] = React.useState(params);

  const debouncedSetParams = useDebouncedCallback(setDebouncedParams, 500);

  React.useEffect(() => {
    debouncedSetParams(params);
  }, [params, debouncedSetParams]);

  const {
    data: orderData,
    isLoading: isLoadingOrders,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["orders", debouncedParams, accessToken],
    queryFn: () => orderApiRequest.getList(accessToken, debouncedParams),
    enabled: !!accessToken,
  });

  const {
    data: tableData,
    isLoading: isLoadingTables,
    refetch: refetchTables,
  } = useQuery({
    queryKey: ["tables"],
    queryFn: () => tableApiRequest.getList({ sort: "number.asc" }),
  });

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<IOrder> | null>(null);
  const columns = React.useMemo(
    () => getColumns({ setRowAction, role }),
    [role],
  );

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<IOrder>[] = [
    {
      id: "code",
      label: "Mã đơn hàng",
      placeholder: "Lọc theo mã đơn hàng",
    },
    {
      id: "customer",
      label: "Mã khách hàng",
      placeholder: "Lọc theo mã khách hàng",
    },
    {
      id: "status",
      label: "Trạng thái",
      options: getVietnameseOrderStatusList().map((status) => status),
    },
    {
      id: "tableNumber",
      label: "Số bàn",
      options: tableData?.data?.map((table) => ({
        label: `Bàn số ${table.number}`,
        value: table.number,
      })),
    },
  ];
  const { table } = useDataTable({
    data: orderData?.data || [],
    columns,
    pageCount: orderData?.meta.totalPages || 0,
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
      columnVisibility: {
        updatedAt: false,
        cookingCompletedAt: false,
        paidAt: false,
      },
    },
    getRowId: (originalRow) => originalRow._id,
    shallow: false,
    clearOnDefault: true,
  });

  React.useEffect(() => {
    if (!socket) return;

    // Trong trường hợp JWT Expired thì socket chưa connect đến server đâu nên ở đây sẽ re-connect lại
    // if (!socket.connected) {
    //   return
    // }

    const onNewOrders = ({
      tableNumber,
      quantity,
    }: {
      tableNumber: number;
      quantity: number;
    }) => {
      refetchOrders();
      refetchTables();
      // router.refresh();

      toast("🔔 Đơn hàng mới", {
        description: `Bàn số ${tableNumber} đã gọi ${quantity} món ăn`,
      });
    };

    const onUpdatedOrder = () => {
      refetchOrders();
      refetchTables();
      // router.refresh();
    };

    socket.on("newOrders", onNewOrders);

    socket.on("updatedOrder", onUpdatedOrder);

    return () => {
      socket.off("newOrders", onNewOrders);
      socket.off("updatedOrder", onUpdatedOrder);
    };
  }, [router, socket]);

  return (
    <>
      {session?.account?.role !== Role.Chef && (
        <div className="custom-scrollbar flex max-w-[1040px] space-x-4 overflow-x-auto py-4 pl-[2px]">
          {/* {statisticsByTablesData.map((statistic) => (
            <StatisticCard key={statistic.tableNumber} statistic={statistic} />
          ))} */}
          {tableData?.data?.map((table) => (
            <Card
              onClick={() => {
                if (table.status === TableStatus.Available) {
                  router.push(
                    `${ROUTES.DASHBOARD.ORDERS_CREATE}?tableNumber=${table.number}`,
                  );
                } else if (table.status === TableStatus.Occupied) {
                  router.push(
                    `${ROUTES.DASHBOARD.ORDERS_CHECKOUT}?tableId=${table._id}`,
                  );
                }
              }}
              key={table.number}
              className={cn("h-full shrink-0 cursor-pointer text-sm", {
                "cursor-not-allowed opacity-90":
                  table.status === TableStatus.Hidden,
              })}
            >
              <CardContent className="p-0">
                <div className="flex h-full items-center gap-x-2 px-4 py-3">
                  <div className="shrink-0 font-medium">
                    <div className="flex items-center gap-x-1">
                      <Table size={20} />
                      <div className="text-[17px]">{table.number}</div>
                    </div>
                  </div>
                  <Separator
                    orientation="vertical"
                    className="mx-1 h-20 w-[1.5px] shrink-0"
                  />
                  <div className="flex h-[92px] max-w-16 items-center pt-3 text-center text-sm capitalize">
                    {table.status === TableStatus.Available && "Sẵn sàng"}
                    {table.status === TableStatus.Occupied && "Đang có khách"}
                    {table.status === TableStatus.Hidden && "Đã ẩn"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <DataTable
        className="mt-3"
        table={table}
        tableDivClassName="max-h-[65vh] custom-scrollbar rounded-sm"
      >
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          translateHeaderFunc={translateOrderKey as any}
        >
          <OrdersTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>
      <DeleteOrdersDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
        orders={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
