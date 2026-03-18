"use client";

import customerApiRequest from "@/apiRequests/customer.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/constants/constants";
import { OrderStatus } from "@/constants/enum";
import {
  formatNumberToVnCurrency,
  getBadgeVariantByOrderStatus,
  getVietnameseOrderStatus,
} from "@/lib/utils";
import { useSocket } from "@/providers/socket-provider";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

interface CustomerOrderProps {
  session: Session | null;
}

export default function CustomerOrder({ session }: CustomerOrderProps) {
  const accessToken = session?.accessToken ?? "";
  const { data: response, refetch: refetchOrders } = useQuery({
    queryKey: ["customerOrders", accessToken],
    queryFn: () => customerApiRequest.getOrders(accessToken),
    enabled: !!accessToken,
  });

  debugger;

  const orderList = Array.isArray(response?.data) ? response.data : [];
  const socket = useSocket();

  console.log("=== CUSTOMER ORDERS DEBUG ===");
  console.log("Full API response:", response);
  console.log("Response data type:", typeof response?.data);
  console.log("Is data array?:", Array.isArray(response?.data));
  console.log("Extracted orderList:", orderList);
  console.log("OrderList length:", orderList.length);
  console.log("================================");

  const totalQuantity = orderList.reduce(
    (result, order) => result + order.quantity,
    0,
  );
  const totalPrice = orderList.reduce(
    (result, order) => result + order.totalPrice,
    0,
  );

  React.useEffect(() => {
    if (!socket) return;

    // Trong trường hợp JWT Expired thì socket chưa connect đến server đâu nên ở đây sẽ re-connect lại
    if (!socket.connected) {
      // router.refresh();
      refetchOrders();
    }

    const onUpdatedOrder = ({
      dishTitle,
      status,
    }: {
      dishTitle: string;
      status: OrderStatus;
    }) => {
      toast(
        `📢 Món "${dishTitle}" vừa được chuyển sang trạng thái "${getVietnameseOrderStatus(status)}"`,
      );
      // router.refresh();
      refetchOrders();
    };

    const onNewOrders = ({
      quantity,
    }: {
      tableNumber: number;
      quantity: number;
    }) => {
      // router.refresh();
      refetchOrders();
      toast("🔔 Đơn hàng mới", {
        description: `Nhân viên đã gọi thêm ${quantity} món ăn!`,
      });
    };

    socket.on("updatedOrder", onUpdatedOrder);
    socket.on("newOrders", onNewOrders);

    return () => {
      socket.off("updatedOrder", onUpdatedOrder);
      socket.off("newOrders", onNewOrders);
    };
  }, [refetchOrders, socket]);

  if (orderList.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-lg">
        <div>Bạn chưa gọi món</div>
        <Link href={ROUTES.HOME}>
          <Button variant={"default"}>Gọi món tại đây</Button>
        </Link>
      </div>
    );
  }

  const { tableNumber, code } = orderList[0];

  return (
    <Card className="mx-5 my-12 max-w-[750px] md:mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl md:text-2xl">
          Món ăn đã gọi - Bàn số {tableNumber}
        </CardTitle>
        <div className="flex flex-row items-center justify-between pt-4 text-base">
          <h2 className="text-sm font-semibold md:text-base">Mã đơn: {code}</h2>
        </div>
      </CardHeader>

      <CardContent>
        <Table divClassname="max-h-[65vh] custom-scrollbar rounded-sm">
          <TableHeader className="sticky top-0 rounded-sm bg-gray-100">
            <TableRow>
              <TableHead className="text-gray-700">Món ăn</TableHead>
              <TableHead className="text-gray-700">Đơn giá</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <div className="flex items-start gap-x-2 font-normal">
                    <Image
                      width={80}
                      height={80}
                      sizes="100vw"
                      className="h-20 w-20 rounded-sm object-cover"
                      alt={order.dish?.title ?? ""}
                      src={order.dish?.imageUrl ?? ""}
                    />
                    <div>
                      <h3 className="line-clamp-2 w-52">{order.dish?.title}</h3>
                      <Badge
                        variant={getBadgeVariantByOrderStatus(order.status)}
                        className="my-1"
                      >
                        {getVietnameseOrderStatus(order.status)}
                      </Badge>
                      <div className="text-[13px] font-medium italic">
                        x{order.quantity}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatNumberToVnCurrency(order.price)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="sticky bottom-0 rounded-sm bg-gray-100">
            <TableRow>
              <TableCell colSpan={1}>Tổng ({totalQuantity} phần):</TableCell>
              <TableCell className="text-right text-lg font-bold text-red-600">
                {formatNumberToVnCurrency(totalPrice)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      <CardFooter className="sticky bottom-0 flex-col items-center">
        <Link href={ROUTES.HOME}>
          <Button variant={"green"} className="">
            Gọi thêm món
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
