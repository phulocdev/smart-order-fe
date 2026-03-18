"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/constants/constants";
import http from "@/lib/http";
import { handleApiError } from "@/lib/utils";
import { useAppStore } from "@/providers/zustand-provider";
import { ApiResponse } from "@/types/response.type";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Denk_One } from "next/font/google";
import { useState } from "react";

export default function LogoutButton({ session }: { session: Session }) {
  const { refreshToken, accessToken } = session;
  const clearOrderInCart = useAppStore((state) => state.clearOrderInCart);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    debugger;
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      if (session.account) {
        await http.post<ApiResponse<[]>>(
          `${ROUTES.API.AUTH}/logout`,
          { refreshToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      } else {
        // Customer logout
        await http.post<ApiResponse<[]>>(
          ROUTES.API.CUSTOMERS_AUTH_LOGOUT,
          { refreshToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      }
    } catch (error) {
      debugger;
      handleApiError({ error });
    } finally {
      debugger;
      // Always sign out and clear cart
      if (session.account) {
        await signOut({ callbackUrl: ROUTES.LOGIN });
      } else {
        await signOut({ callbackUrl: ROUTES.HOME });
        if (session.customer) {
          clearOrderInCart(session.customer.tableNumber);
        }
      }
      setIsLoggingOut(false);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="w-full text-left">
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Đăng xuất
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <p>Bạn có muốn đăng xuất?</p>
          </AlertDialogTitle>
          {session?.customer && (
            <AlertDialogDescription>
              Bạn sẽ không thể tiếp tục tự gọi món
            </AlertDialogDescription>
          )}
          {session?.account && (
            <AlertDialogDescription>
              Hành động này sẽ thoát khỏi phiên làm việc của bạn
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoggingOut}>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Đang đăng xuất..." : "Xác nhận"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
