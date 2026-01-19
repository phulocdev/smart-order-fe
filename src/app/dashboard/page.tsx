import dashboardApiRequest from "@/apiRequests/dashboard.api";
import { RevenueChart } from "@/app/dashboard/_components/revenue-chart";
import { dashboardSearchParamsCache } from "@/app/dashboard/_lib/validation";
import { getAuthSession } from "@/auth";
import AdvanceDateRange from "@/components/advance-date-range";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Role } from "@/constants/enum";
import { ROUTES } from "@/constants/constants";
import {
  formatNumberToVnCurrency,
  formatNumberWithCommas,
  getVietnameseDayOfWeek,
} from "@/lib/utils";
import type { SearchParams } from "@/types/data-table.type";
import { format, getDate, getMonth, getYear } from "date-fns";
import {
  DollarSignIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function DashboardPage(props: Props) {
  const session = await getAuthSession();
  const searchParams = await props.searchParams;
  const accessToken = session?.accessToken ?? "";

  if (session?.account?.role !== Role.Manager) {
    redirect(ROUTES.DASHBOARD.ORDERS);
  }

  const search = dashboardSearchParamsCache.parse(searchParams);
  const from = format(search.from, "yyyy-MM-dd");
  const to = format(search.to, "yyyy-MM-dd");

  const {
    data: { countCustomers, countOrders, revenueChartData, totalRevenue },
  } = await dashboardApiRequest.getStatistics(accessToken, { from, to });

  const now = new Date();
  const day = getVietnameseDayOfWeek(now);
  const date = getDate(now);
  const month = getMonth(now) + 1;
  const year = getYear(now);

  return (
    <div className="px-2 py-5 md:px-4 lg:px-9">
      <section>
        <div>
          <div className="text-2xl font-semibold capitalize">Xin chào!</div>
          <p className="mt-2 text-sm">
            {day}, {date} tháng {month}, {year}
          </p>
        </div>
        <div className="pt-6">
          <p className="pb-3 text-sm font-medium text-gray-600">
            Chọn khoảng thời gian
          </p>
          <AdvanceDateRange from={search.from} to={search.to} />
        </div>
      </section>
      <div className="grid grid-cols-1 gap-5 py-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="">
          <CardHeader className="relative">
            <CardDescription>Doanh thu</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {formatNumberToVnCurrency(totalRevenue)}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <DollarSignIcon className="size-4" />
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up this month <TrendingUpIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Số lượt khách</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {formatNumberWithCommas(countCustomers)}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Down 20% this period <TrendingDownIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Acquisition needs attention
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Số lượng đơn</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {formatNumberWithCommas(countOrders)}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <TrendingUpIcon className="size-4" />
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Strong user retention <TrendingUpIcon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Engagement exceed targets
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* Charts */}
      <RevenueChart
        from={search.from}
        to={search.to}
        chartData={revenueChartData}
      />
    </div>
  );
}
