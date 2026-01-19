"use client";

import type { Row } from "@tanstack/react-table";
import { Loader, Trash } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { IAccount } from "@/types/auth.type";
import { useRemoveAccountMutation } from "@/hooks/api/useAccount";
import { handleApiError } from "@/lib/utils";

interface DeleteAccountDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  account?: Row<IAccount>["original"];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteAccountDialog({
  account,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteAccountDialogProps) {
  const removeAccountMutation = useRemoveAccountMutation();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  async function onDelete() {
    try {
      if (!account) return;
      await removeAccountMutation.mutateAsync(account._id);
      onSuccess?.();
    } catch (error) {
      handleApiError({ error });
    }
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="max-w-[90%] leading-6">
              Bạn có chắc chắn muốn xóa tài khoản {account?.email}?
            </DialogTitle>
            <DialogDescription>
              Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh
              viễn tài khoản khỏi máy chủ.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={removeAccountMutation.isPending}
            >
              {removeAccountMutation.isPending && (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Xóa tài khoản
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bạn có chắc chắn muốn xóa tài khoản không?</DrawerTitle>
          <DrawerDescription>
            Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn
            tài khoản khỏi máy chủ.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Hủy</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={removeAccountMutation.isPending}
          >
            {removeAccountMutation.isPending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Xóa
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default DeleteAccountDialog;
