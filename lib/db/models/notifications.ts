import mongoose from "mongoose";
import { NOTIFICATION } from "@/utils/enums/enums";

const ObjectId = mongoose.Schema.Types.ObjectId;

export interface INotification {
  _id: mongoose.Types.ObjectId;
  title: string;
  subject: string;
  notificationBody?: string;
  notificationStatus: NOTIFICATION;
  notificationSeenStatus?: Array<NotificationSeenType>;
}

interface NotificationSeenType {
  userRef: mongoose.Types.ObjectId;
  seenAt: Date;
  isSeen: boolean;
}

export interface INotificationDocument extends INotification, Document {
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new mongoose.Schema<INotificationDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    notificationBody: {
      type: String,
      required: false,
    },
    notificationStatus: {
      type: String,
      enum: Object.values(NOTIFICATION),
      default: NOTIFICATION.UNREAD,
    },
    notificationSeenStatus: {
      type: [
        {
          userRef: {
            type: ObjectId,
            ref: "Notification",
          },
          seenAt: {
            type: Date,
            default: null,
          },
          isSeen: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

NotificationSchema.index({ name: "text" });

export const Notification = mongoose.model<INotificationDocument>(
  "Notification",
  NotificationSchema,
);
