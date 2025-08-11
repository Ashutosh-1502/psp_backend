import { User } from "@/db/models/user";
import { Sequence } from "@/db/models/sequences";
import { Notification } from "@/db/models/notifications";
import { STATUS, USER_TYPE, NOTIFICATION } from "@/utils/enums/enums";
import { DashboardType } from "@/utils/interfaces/module/dashboard";

export class DashboardHelpers {
  public static findUsers = async () => {
    return User.find({ roles: USER_TYPE.USER })
      .populate({
        path: "sequences",
        options: { strictPopulate: false },
      })
      .sort({ createdAt: -1 });
  };

  public static findNotifications = async () => {
    return Notification.find({}).sort({ createdAt: -1 });
  };

  public static findSequences = async () => {
    return Sequence.find({}).sort({ createdAt: -1 });
  };

  public static manageUser = async (id: string, operation: STATUS) => {
    return User.findOneAndUpdate(
      { _id: id },
      { $set: { status: operation } },
      { returnDocument: "after" },
    );
  };

  public static newAnnouncement = async (notification: DashboardType) => {
    return Notification.create({
      title: notification.title,
      subject: notification.subject,
      notificationBody: notification.notificationBody,
    });
  };

  public static manageNotification = async (
    id: string,
    notification: DashboardType,
    userId: string,
  ) => {
    switch (notification.operation) {
      case NOTIFICATION.DELETED:
        return Notification.deleteOne({ _id: id });

      case NOTIFICATION.READ:
        return Notification.findOneAndUpdate (
          {
            _id: id,
            "notificationSeenStatus.userRef": userId,
          },
          {
            $set: {
              "notificationSeenStatus.$.isSeen": true,
              "notificationSeenStatus.$.seenAt": new Date(),
            },
          },
          {
            returnDocument: "after"
          }
        );
    }
  };
}
