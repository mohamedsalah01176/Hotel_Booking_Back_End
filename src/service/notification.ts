import mongoose, { Types } from "mongoose";
import Notification from "../model/notification";
import UserModel from "../model/user";
import pusher from "../config/pusher";

const translate = require("translate-google");

type NotificationType =
  | "general"
  | "booking"
  | "payment"
  | "promotion";

interface SendNotificationData {
  userId: string | string[];
  title: string;
  titleEn?: string;
  titleAr?: string;
  message: string;
  messageEn?: string;
  messageAr?: string;
  type?: NotificationType;
}

const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

class NotificationService {
  // Admin or system sends a notification to one or more users
  async sendToUsers(data: SendNotificationData) {
    const { userId, title, message, type = "general" } = data;

    if (!userId || (Array.isArray(userId) && userId.length === 0)) {
      throw new Error("At least one user is required");
    }

    if (!title.trim() || !message.trim()) {
      throw new Error("Title and message are required");
    }

    const userIds = Array.isArray(userId) ? userId : [userId];

    // Verify that all recipients exist
    const users = await UserModel.find({
      _id: { $in: userIds },
    })
      .select("_id")
      .lean();

    if (users.length === 0) {
      return {
        notifications: [],
        total: 0,
        deliveredToPusher: 0,
        failedPushes: 0,
      };
    }

    // Determine / compute translations
    let titleEn = data.titleEn;
    let titleAr = data.titleAr;
    let messageEn = data.messageEn;
    let messageAr = data.messageAr;

    try {
      if (!titleEn || !titleAr) {
        if (isArabic(title)) {
          titleAr = titleAr || title.trim();
          titleEn = titleEn || (await translate(title, { from: "ar", to: "en" }));
        } else {
          titleEn = titleEn || title.trim();
          titleAr = titleAr || (await translate(title, { from: "en", to: "ar" }));
        }
      }

      if (!messageEn || !messageAr) {
        if (isArabic(message)) {
          messageAr = messageAr || message.trim();
          messageEn = messageEn || (await translate(message, { from: "ar", to: "en" }));
        } else {
          messageEn = messageEn || message.trim();
          messageAr = messageAr || (await translate(message, { from: "en", to: "ar" }));
        }
      }
    } catch (transErr) {
      console.error("Notification translation error, falling back to original:", transErr);
      titleEn = titleEn || title.trim();
      titleAr = titleAr || title.trim();
      messageEn = messageEn || message.trim();
      messageAr = messageAr || message.trim();
    }

    // Save a separate notification for every recipient
    const notifications = await Notification.insertMany(
      users.map((user) => ({
        userId: user._id,
        title: title.trim(),
        titleEn,
        titleAr,
        message: message.trim(),
        messageEn,
        messageAr,
        type,
        isRead: false,
      }))
    );

    // Send real-time events to each recipient's private channel
    const results = await Promise.allSettled(
      notifications.map((notification: any) =>
        pusher.trigger(
          `private-user-${notification.userId.toString()}`,
          "new-notification",
          {
            _id: notification._id.toString(),
            title: notification.title,
            titleEn: notification.titleEn,
            titleAr: notification.titleAr,
            message: notification.message,
            messageEn: notification.messageEn,
            messageAr: notification.messageAr,
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
    limit = 20,
    lang?: string
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

    const formattedNotifications = notifications.map((n: any) => {
      let localizedTitle = n.title;
      let localizedMessage = n.message;

      if (lang === "ar") {
        localizedTitle = n.titleAr || n.title;
        localizedMessage = n.messageAr || n.message;
      } else if (lang === "en") {
        localizedTitle = n.titleEn || n.title;
        localizedMessage = n.messageEn || n.message;
      }

      return {
        ...n,
        title: localizedTitle,
        message: localizedMessage,
      };
    });

    return {
      notifications: formattedNotifications,
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