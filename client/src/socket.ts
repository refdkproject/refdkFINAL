import { io } from "socket.io-client";

let socket: ReturnType<typeof io> | null;

export const getSocket = () => {
  if (!socket) {
    socket = io(`${import.meta.env.VITE_BASE_URL}`); 
  }
  return socket;
};
