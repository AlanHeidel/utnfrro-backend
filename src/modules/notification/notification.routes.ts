import { Router } from "express";
import {
  createMozoCallFromTableDevice,
  listNotifications,
  updateNotificationEstado,
} from "./notification.controller.js";
import {
  requireAuth,
  requireRole,
  requireTableDevice,
} from "../../middlewares/auth.middleware.js";
import { AccountRole } from "../account/account.entity.js";

export const notificationRouter = Router();

notificationRouter.post(
  "/table/mozo-call",
  requireTableDevice,
  createMozoCallFromTableDevice,
);

notificationRouter.get(
  "/",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  listNotifications,
);

notificationRouter.patch(
  "/:id/estado",
  requireAuth,
  requireRole(AccountRole.ADMIN),
  updateNotificationEstado,
);
