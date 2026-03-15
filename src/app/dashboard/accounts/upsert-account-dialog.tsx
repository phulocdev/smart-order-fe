import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/constants/enum";
import {
  useCreateAccountMutation,
  useUpdateAccountMutation,
} from "@/hooks/api/useAccount";
import { cn, handleApiError } from "@/lib/utils";
import { IAccount } from "@/types/auth.type";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

interface UpsertAccountDialogProps {
  open?: boolean;
  type: "update" | "create";
  account?: IAccount;
  onSuccess?: () => void;
  onOpenChange: () => void;
}

export default function UpsertAccountDialog({
  onSuccess,
  open = false,
  onOpenChange,
  type,
  account,
}: UpsertAccountDialogProps) {
  const createAccountMutation = useCreateAccountMutation();
  const updateAccountMutation = useUpdateAccountMutation();

  const form = useForm<IAccount>({
    defaultValues: {
      email: "",
      fullName: "",
      avatarUrl: "",
      role: Role.Waiter,
    },
  });

  // Update case
  React.useEffect(() => {
    if (account) {
      form.reset({ ...account });
    }
  }, [account, form]);

  async function onSubmit(values: IAccount) {
    try {
      if (type === "create") {
        await createAccountMutation.mutateAsync(values);
      } else if (account) {
        await updateAccountMutation.mutateAsync({
          id: account._id,
          body: values,
        });
      }
      form.reset();
      onSuccess?.();
    } catch (error) {
      handleApiError({ error, setError: form.setError });
    }
  }

  function onDialogClose() {
    onOpenChange();
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onDialogClose}>
      <DialogContent className="min-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {type === "create" ? "Thêm mới" : "Chỉnh sửa"} tài khoản
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <Form {...form}>
            <form
              id="upsertAccountForm"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập email..."
                        {...field}
                        disabled={type === "update"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đầy đủ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên đầy đủ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập đường dẫn avatar..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai trò</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Role).map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogDescription>
        <DialogFooter>
          <Button variant={"outline"} onClick={onDialogClose}>
            Hủy
          </Button>
          <Button
            form="upsertAccountForm"
            type="submit"
            className={cn({
              "cursor-not-allowed opacity-50":
                createAccountMutation.isPending ||
                updateAccountMutation.isPending,
            })}
          >
            {(createAccountMutation.isPending ||
              updateAccountMutation.isPending) && (
              <Loader2 className="animate-spin" />
            )}
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
