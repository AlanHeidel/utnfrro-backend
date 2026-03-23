import { Server as HttpServer } from "http";
import { AnyTokenPayload, verifyToken } from "../../modules/auth/auth.utils.js";
import { AccountRole } from "../../modules/account/account.entity.js";
import { FRONTEND_BASE_URL, IS_PROD } from "../../config/config.js";

type SocketLike = {
  handshake?: {
    auth?: Record<string, unknown>;
    headers?: Record<string, unknown>;
  };
  data: Record<string, unknown>;
  join: (room: string) => void;
  emit: (event: string, payload: unknown) => void;
};

type SocketServerLike = {
  use: (middleware: (socket: SocketLike, next: (error?: Error) => void) => void) => void;
  on: (event: "connection", listener: (socket: SocketLike) => void) => void;
  to: (room: string) => { emit: (event: string, payload: unknown) => void };
};

type NotificationEventPayload = {
  id: number;
  mesa: {
    id: number;
    numeroMesa: number | null;
  };
  estado: string;
  createdAt: string;
  message: string;
};

const ADMIN_ROOM = "admins";
let io: SocketServerLike | null = null;

const defaultAllowedOrigins = IS_PROD
  ? [FRONTEND_BASE_URL]
  : [FRONTEND_BASE_URL, "http://localhost:5173", "http://127.0.0.1:5173"];

const envAllowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...defaultAllowedOrigins, ...envAllowedOrigins]);

function isAllowedOrigin(origin?: string) {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  return false;
}

function getBearerToken(socket: SocketLike) {
  const authToken = socket.handshake?.auth?.token;
  if (typeof authToken === "string" && authToken.trim()) {
    return authToken.trim().replace(/^Bearer\s+/i, "");
  }

  const header = socket.handshake?.headers?.authorization;
  if (typeof header === "string" && header.startsWith("Bearer ")) {
    return header.slice(7);
  }

  return null;
}

function getSocketModuleName() {
  return "socket.io";
}

export async function initSocket(server: HttpServer) {
  if (io) return io;

  try {
    const socketIOModule = await import(getSocketModuleName());
    const SocketIOServer = (socketIOModule as any).Server;
    if (!SocketIOServer) {
      console.warn("Socket.IO module loaded but Server class is missing");
      return null;
    }

    io = new SocketIOServer(server, {
      cors: {
        origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
          if (isAllowedOrigin(origin)) return callback(null, true);
          return callback(new Error(`Socket CORS blocked origin: ${origin ?? "unknown"}`));
        },
        methods: ["GET", "POST"],
        credentials: true,
      },
    }) as SocketServerLike;

    io.use((socket, next) => {
      try {
        const token = getBearerToken(socket);
        if (!token) return next(new Error("missing token"));

        const payload = verifyToken(token) as AnyTokenPayload;
        socket.data.user = payload;
        return next();
      } catch {
        return next(new Error("invalid or expired token"));
      }
    });

    io.on("connection", (socket) => {
      const user = socket.data.user as AnyTokenPayload | undefined;
      if (!user) return;

      if (user.kind === "account" && user.role === AccountRole.ADMIN) {
        socket.join(ADMIN_ROOM);
      }

      if (user.kind === "table-device") {
        socket.join(`mesa:${user.mesaId}`);
      }

      socket.emit("realtime:ready", { connected: true, kind: user.kind });
    });

    return io;
  } catch (error) {
    console.warn("Socket.IO could not be initialized", error);
    return null;
  }
}

export function emitMozoCallCreated(payload: NotificationEventPayload) {
  if (!io) return;
  io.to(ADMIN_ROOM).emit("notification:created", payload);
}

export function emitMozoCallUpdated(payload: NotificationEventPayload) {
  if (!io) return;
  io.to(ADMIN_ROOM).emit("notification:updated", payload);
  io.to(`mesa:${payload.mesa.id}`).emit("notification:updated", payload);
}
