import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/constants";
import { House } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-blue-50 dark:bg-zinc-950">
      <Link href={ROUTES.HOME}>
        <Button variant={"outline"} className="absolute left-4 top-4">
          <House />
          Trang chủ
        </Button>
      </Link>
      {children}
    </section>
  );
}
