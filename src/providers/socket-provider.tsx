"use client";

import envConfig from "@/config/env";
import { ROUTES } from "@/constants/constants";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: session } = useSession();
  const accessToken = session?.accessToken ?? "";
  const router = useRouter();

  useEffect(() => {
    if (!session) return;

    // Trong trường hợp AT hết hạn thì vẫn tạo ra 1 instance có url connect thành công đến websocket server - Chỉ là chưa connect mà thôi
    const socketInstance = io(`${envConfig.NEXT_PUBLIC_WEBSOCKET_URL}`, {
      autoConnect: true,
      transports: ["websocket", "polling"],
      auth: {
        role: session.account ? "employee" : "customer",
        authorization: accessToken,
      },
    });

    setSocket(socketInstance);

    socketInstance.on("logout", () => {
      router.push(ROUTES.LOGOUT);
    });

    return () => {
      // Disconnect from client
      socketInstance.disconnect();
      socketInstance.off("logout");
    };
  }, [accessToken, router, session]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): Socket | null => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};
