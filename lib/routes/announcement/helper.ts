import { Notification } from "@/db/models/notifications";

export class AnnouncementHelpers {
  public static findNotifications = async () => {
    return Notification.find({}).sort({ createdAt: -1 });
  };

  public static manageNotification = async (id: string, userId: string) => {
    return Notification.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          notificationSeenStatus: {
            userRef: userId,
            isSeen: true,
            seenAt: new Date(),
          },
        },
      },
      { returnDocument: "after" },
    );
  };
}
