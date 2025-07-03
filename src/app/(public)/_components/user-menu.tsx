import LogoutButton from "@/app/(public)/_components/logout-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";

interface Props {
  session: Session | null;
}

export default async function UserMenu({ session }: Props) {
  const isEmployee = !!session?.account;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!session && (
          <DropdownMenuItem>
            <Link href={"/login"} className="w-full">
              Đăng nhập
            </Link>
          </DropdownMenuItem>
        )}
        {isEmployee && (
          <DropdownMenuItem>
            <Link href={"/dashboard"} className="w-full">
              Quản lý
            </Link>
          </DropdownMenuItem>
        )}
        {session && <LogoutButton session={session} />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
