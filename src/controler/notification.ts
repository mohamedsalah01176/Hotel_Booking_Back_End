
import { Request, Response } from "express";
import notificationService from "../service/notification";
import { getUserId } from "../util/getUserId";
import pusher from "../config/pusher";



class NotificationController {
  // POST: Authorize the current user for their own Pusher private channel
  async authorizePusherChannel(req: Request, res: Response) {
    try {
      const { socket_id: socketId, channel_name: channelName } = req.body;

      if (typeof socketId !== "string" || typeof channelName !== "string") {
        return res.status(400).json({
          success: false,
          message: "socket_id and channel_name are required",
        });
      }

      const expectedChannel = `private-user-${getUserId(req)}`;
      if (channelName !== expectedChannel) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to subscribe to this channel",
        });
      }

      // Pusher's current server SDK exposes this as authorizeChannel.
      return res.status(200).json(pusher.authorizeChannel(socketId, channelName));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";

      return res.status(500).json({ success: false, message });
    }
  }

  // POST: Admin sends notification to users
  async send(req: Request, res: Response) {
    try {
      const { userId, title, message, type } = req.body;

      console.log(!Array.isArray(userId));
      console.log(userId);
      console.log(typeof title !== "string");
      console.log(typeof message !== "string")
      console.log(req.body)
      if (
        !userId ||
        typeof title !== "string" ||
        typeof message !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "userIds, title, and message are required",
        });
      }

      const result = await notificationService.sendToUsers({
        userId,
        title,
        message,
        type,
      });

      return res.status(201).json({
        success: true,
        message: "Notifications saved",
        total: result.total,
        deliveredToPusher: result.deliveredToPusher,
        failedPushes: result.failedPushes,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";

      const status = [
        "At least one user is required",
        "Invalid user ID",
        "Title and message are required",
        "One or more users were not found",
      ].includes(message)
        ? 400
        : 500;

      return res.status(status).json({
        success: false,
        message,
      });
    }
  }

  // GET: Current user's notifications
  async getMine(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const result = await notificationService.getUserNotifications(
        userId,
        page,
        limit
      );

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";

      return res.status(500).json({ success: false, message });
    }
  }

  // GET: Current user's unread count
  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const count = await notificationService.getUnreadCount(userId);

      return res.status(200).json({
        success: true,
        count,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";

      return res.status(500).json({ success: false, message });
    }
  }

  // PATCH: Mark one notification as read
  async markAsRead(req: Request, res: Response) {
    try {
      const userId = getUserId(req);

      const notification = await notificationService.markAsRead(
        userId,
        req.params.id
      );

      return res.status(200).json({
        success: true,
        notification,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";

      const status =
        message === "Invalid notification ID"
          ? 400
          : message === "Notification not found"
            ? 404
            : 500;

      return res.status(status).json({ success: false, message });
    }
  }

  // PATCH: Mark all notifications as read
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = getUserId(req);
      const result = await notificationService.markAllAsRead(userId);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";

      return res.status(500).json({ success: false, message });
    }
  }
}

export default new NotificationController();
