import { Router } from "express";
import {authorizationForManager,authentication} from "../meddileware/user";
import notificationController from "../controler/notification";


const router = Router();

// Pusher private-channel authentication for the current user.
router.post(
  "/pusher/auth",
  authentication,
  notificationController.authorizePusherChannel
);

// Admin routes
router.post(
  "/admin/notifications",
  authentication,
  authorizationForManager,
  notificationController.send
);

// User routes
router.get(
  "/notifications",
  authentication,
  notificationController.getMine
);

router.get(
  "/notifications/unread-count",
  authentication,
  notificationController.getUnreadCount
);

router.patch(
  "/notifications/read-all",
  authentication,
  notificationController.markAllAsRead
);

router.patch(
  "/notifications/:id/read",
  authentication,
  notificationController.markAsRead
);

export default router;
