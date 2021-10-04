import { FC } from "react";
import { createContext } from "react";
import { io, Socket } from "socket.io-client";

export const socket = io("http://localhost:8000");
export const SocketContext = createContext<Socket | null>(null);
