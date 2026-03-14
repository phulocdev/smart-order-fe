import customerApiRequest from "@/apiRequests/customer.api";
import CustomerOrder from "@/app/customer/orders/customer-orders";
import { getAuthSession } from "@/auth";
import * as React from "react";

export default async function Page() {
  const session = await getAuthSession();
  const accessToken = session?.accessToken ?? "";
  const promise = customerApiRequest.getOrders(accessToken);

  return (
    <React.Suspense fallback={<div>...Loading</div>}>
      <CustomerOrder promise={promise} />
    </React.Suspense>
  );
}
