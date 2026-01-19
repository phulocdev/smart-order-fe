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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableStatus } from "@/constants/enum";
import { cn, handleApiError } from "@/lib/utils";
import { ITable } from "@/types/backend.type";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import {
  useCreateTableMutation,
  useUpdateTableMutation,
} from "@/hooks/api/useTable";

interface UpsertTableDialogProps {
  open?: boolean;
  type: "update" | "create";
  table?: ITable;
  onSuccess?: () => void;
  onOpenChange: () => void;
}

export default function UpsertTableDialog({
  onSuccess,
  open = false,
  onOpenChange,
  type,
  table,
}: UpsertTableDialogProps) {
  const createTableMutation = useCreateTableMutation();
  const updateTableMutation = useUpdateTableMutation();

  const form = useForm<Partial<ITable>>({
    defaultValues: {
      number: undefined,
      status: TableStatus.Available,
      reservationLink: "",
    },
  });

  // Update case
  React.useEffect(() => {
    if (table) {
      form.reset({ ...table });
    }
  }, [table, form]);

  async function onSubmit(values: Partial<ITable>) {
    try {
      if (type === "create") {
        await createTableMutation.mutateAsync(values);
      } else if (table) {
        await updateTableMutation.mutateAsync({ id: table._id, body: values });
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
            {type === "create" ? "Thêm mới" : "Chỉnh sửa"} bàn ăn
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <Form {...form}>
            <form
              id="upsertTableForm"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số bàn</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập số bàn..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(TableStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reservationLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đường dẫn đặt chỗ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập đường dẫn đặt chỗ..."
                        {...field}
                      />
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
            form="upsertTableForm"
            type="submit"
            className={cn({
              "cursor-not-allowed opacity-50":
                createTableMutation.isPending || updateTableMutation.isPending,
            })}
          >
            {(createTableMutation.isPending ||
              updateTableMutation.isPending) && (
              <Loader2 className="animate-spin" />
            )}
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
