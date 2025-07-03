import UserMenu from "@/app/(public)/_components/user-menu";
import { getAuthSession } from "@/auth";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Header() {
  const session = await getAuthSession();
  const isCustomer = !!session?.customer;

  return (
    <div className="sticky top-0 z-20 bg-white shadow-md dark:border-b dark:border-b-gray-700 dark:bg-background">
      <div className="flex h-8 items-center justify-center bg-third text-sm text-third-foreground">
        Ưu đãi nhất năm - chọn món nhé
      </div>
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <Link href={"/"}>
            <Image
              src={"/logo.svg"}
              alt="Smart-Order"
              width={160}
              height={44}
              className="h-8 w-[118px] object-cover sm:h-11 sm:w-[160px]"
            />
          </Link>
          <div className="flex items-center gap-x-3">
            {isCustomer && (
              <Link href={"/customer/orders"}>
                <Button size={"icon"} variant={"outline"}>
                  <ShoppingCart />
                </Button>
              </Link>
            )}
            <UserMenu session={session} />
          </div>
        </div>
      </div>
    </div>
  );
}
