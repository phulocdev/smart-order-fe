"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  debugger;
  return (
    <div className="flex h-screen flex-col items-center py-28">
      <Image
        src={"/error-image.webp"}
        alt="error"
        width={200}
        height={200}
        className="w-50 aspect-square object-cover"
      />
      <p className="py-4 max-w-xl">{error.message}</p>
      <Button variant={"outline"} onClick={() => router.replace(ROUTES.HOME)}>
        Quay về trang chủ
      </Button>
    </div>
  );
}
