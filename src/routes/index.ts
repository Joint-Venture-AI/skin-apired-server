import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { NotificationRoutes } from '../app/modules/Notification/Notification.route';
import { PersonalisationRoutes } from '../app/modules/personalisation/personalisation.route';
import { PushNotificationRoutes } from '../app/modules/pushNotification/pushNotification.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/notification', route: NotificationRoutes },
  { path: '/personalisation', route: PersonalisationRoutes },
  { path: '/push-notification', route: PushNotificationRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
