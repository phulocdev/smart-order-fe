import dishApiRequest from "@/apiRequests/dish.api";
import tableApiRequest from "@/apiRequests/table.api";
import CreateOrderScreen from "@/app/dashboard/orders/create/create-orders-screen";
import { getAuthSession } from "@/auth";
import { Role } from "@/constants/enum";
import { ROUTES } from "@/constants/constants";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await getAuthSession();
  const accessToken = session?.accessToken ?? "";
  const promises = Promise.all([
    dishApiRequest.getList(),
    tableApiRequest.getList(accessToken),
  ]);

  if (session?.account?.role === Role.Chef) {
    redirect(ROUTES.DASHBOARD.ORDERS);
  }

  return (
    <React.Suspense fallback={<div>...Loading</div>}>
      <CreateOrderScreen promises={promises} />
    </React.Suspense>
  );
}
