import { NOTIFICATION } from "@/utils/enums/enums";

export interface DashboardType {
  title?: string;
  subject?: string;
  notificationBody?: string;
  operation: NOTIFICATION;
}
