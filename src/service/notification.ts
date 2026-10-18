import mongoose, { Types } from "mongoose";
import Notification from "../model/notification";
import UserModel from "../model/user";
import pusher from "../config/pusher";

type NotificationType =
  | "general"
  | "booking"
  | "payment"
  | "promotion";

interface SendNotificationData {
  userIds: string[];
  title: string;
  message: string;
  type?: NotificationType;
}

class NotificationService {
  // Admin sends a notification to one or more users
  async sendToUsers(data: SendNotificationData) {
    const { userIds, title, message, type = "general" } = data;

    if (!userIds.length) {
      throw new Error("At least one user is required");
    }

    if (userIds.some((id) => !mongoose.isValidObjectId(id))) {
      throw new Error("Invalid user ID");
    }

    if (!title.trim() || !message.trim()) {
      throw new Error("Title and message are required");
    }

    // Remove duplicate IDs
    const uniqueUserIds = [...new Set(userIds)];

    // Verify that all recipients exist
    const users = await UserModel.find({
      _id: { $in: uniqueUserIds },
    })
      .select("_id")
      .lean();

    if (users.length !== uniqueUserIds.length) {
      throw new Error("One or more users were not found");
    }

    // Save a separate notification for every recipient
    const notifications = await Notification.insertMany(
      users.map((user) => ({
        userId: user._id,
        title: title.trim(),
        message: message.trim(),
        type,
        isRead: false,
      }))
    );

    // Send real-time events to each recipient's private channel
    const results = await Promise.allSettled(
      notifications.map((notification:any) =>
        pusher.trigger(
          `private-user-${notification.userId.toString()}`,
          "new-notification",
          {
            _id: notification._id.toString(),
            title: notification.title,
            message: notification.message,
            type: notification.type,
            isRead: notification.isRead,
            createdAt: notification.get("createdAt"),
          }
        )
      )
    );

    const failedPushes = results.filter(
      (result) => result.status === "rejected"
    ).length;

    return {
      notifications,
      total: notifications.length,
      deliveredToPusher: results.length - failedPushes,
      failedPushes,
    };
  }

  // Get the logged-in user's notifications
  async getUserNotifications(
    userId: string,
    page = 1,
    limit = 20
  ) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));

    const [notifications, total] = await Promise.all([
      Notification.find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(),

      Notification.countDocuments({ userId }),
    ]);

    return {
      notifications,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    };
  }

  // Count unread notifications
  async getUnreadCount(userId: string) {
    return Notification.countDocuments({
      userId,
      isRead: false,
    });
  }

  // Mark one notification as read, only if it belongs to this user
  async markAsRead(userId: string, notificationId: string) {
    if (!mongoose.isValidObjectId(notificationId)) {
      throw new Error("Invalid notification ID");
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        userId,
      },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      throw new Error("Notification not found");
    }

    return notification;
  }

  // Mark all the logged-in user's notifications as read
  async markAllAsRead(userId: string) {
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    return { modifiedCount: result.modifiedCount };
  }
}

export default new NotificationService();