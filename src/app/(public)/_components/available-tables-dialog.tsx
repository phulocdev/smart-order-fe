"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useGetTableListQuery } from "@/hooks/api/useTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, Copy, Check } from "lucide-react";
import { ITable } from "@/types/backend.type";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";
import { TableStatus } from "@/constants/enum";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tables: ITable[];
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "available":
      return "bg-green-500 text-white";
    case "occupied":
      return "bg-red-500 text-white";
    case "reserved":
      return "bg-yellow-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getStatusLabel = (status: string) => {
  switch (status?.toLowerCase()) {
    case "available":
      return "Có sẵn";
    case "occupied":
      return "Đang dùng";
    case "reserved":
      return "Đã đặt";
    default:
      return status;
  }
};

export default function AvailableTableDialog({
  open,
  onOpenChange,
  tables,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [copiedItem, setCopiedItem] = React.useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    toast({
      description: `${label} đã được sao chép`,
      duration: 2000,
    });
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleSelectTable = (table: ITable) => {
    debugger;
    if (table.status !== TableStatus.Available) {
      toast({
        description: `Bàn số ${table.number} hiện không khả dụng. Vui lòng chọn bàn khác.`,
        variant: "destructive",
      });
      return;
    }

    router.push(table.reservationLink);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh] custom-scrollbar bg-gradient-to-b from-slate-50 to-white">
        <DialogHeader className="pb-4 border-b-2 border-blue-200">
          <DialogTitle className="text-xl font-bold ">
            Quét hoặc Click vào mã QR để bắt đầu gọi món
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600 pt-2">
            <div></div>
            <div className="mb-3">
              Hoặc sử dụng <strong>tài khoản Admin dem</strong>o bên dưới để
              truy cập giao diện quản lý!
            </div>
            {/* Admin Credentials Section */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                👤 Tài khoản Admin Demo
              </h3>
              <div className="space-y-2">
                {/* Email */}
                <div className="flex items-center justify-between bg-white rounded px-3 py-2 border border-blue-100">
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium text-slate-800">
                      phamphuloc7663@gmail.com
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCopy("phamphuloc7663@gmail.com", "Email")
                    }
                    className="ml-2 hover:bg-blue-100"
                  >
                    {copiedItem === "Email" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between bg-white rounded px-3 py-2 border border-blue-100">
                  <div>
                    <p className="text-xs text-slate-500">Mật khẩu</p>
                    <p className="text-sm font-medium text-slate-800 font-mono tracking-widest">
                      123123123
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy("123123123", "Mật khẩu")}
                    className="ml-2 hover:bg-blue-100"
                  >
                    {copiedItem === "Mật khẩu" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>{" "}
          </DialogDescription>
        </DialogHeader>

        <div className="py-8">
          {tables?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Không có bàn nào khi này</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tables?.map((table) => (
                <div
                  key={table._id}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onClick={() => handleSelectTable(table)}
                >
                  <Card className="h-full border-2 border-slate-200 hover:border-blue-500 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden">
                    <CardContent className="flex flex-col items-center justify-center p-6 pb-4">
                      {/* QR Code */}
                      <div className="mb-4 p-3 bg-white rounded-lg border-2 border-slate-200 group-hover:border-blue-400 transition-all">
                        <QRCode
                          value={table.reservationLink}
                          size={180}
                          level="H"
                          // includeMargin={true}
                        />
                      </div>

                      {/* Table Number */}
                      <div className="text-center mb-3">
                        <div className="text-4xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                          {table.number}
                        </div>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                          Bàn số {table.number}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <Badge
                        className={`${getStatusColor(table.status)} mb-3 px-4 py-1 text-sm font-semibold`}
                      >
                        {getStatusLabel(table.status)}
                      </Badge>

                      {/* Capacity Info */}
                      <div className="text-xs text-slate-600 font-medium bg-slate-100 rounded-full px-3 py-1">
                        👥 Sức chứa: {table.capacity} người
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
