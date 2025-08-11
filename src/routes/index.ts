import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { NotificationRoutes } from '../app/modules/Notification/Notification.route';
import { PersonalisationRoutes } from '../app/modules/personalisation/personalisation.route';
import { PushNotificationRoutes } from '../app/modules/pushNotification/pushNotification.route';
import { SkinConditionRoutes } from '../app/modules/skinCondition/skinCondition.route';
import { ProductRoutes } from '../app/modules/product/product.route';
import { AddRoutineRoutes } from '../app/modules/addRoutine/addRoutine.route';
import { PhotoProgessRoutes } from '../app/modules/photoProgess/photoProgess.route';
import { DashboardRoutes } from '../app/modules/dashboard/dashboard.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/notification', route: NotificationRoutes },
  { path: '/personalisation', route: PersonalisationRoutes },
  { path: '/push-notification', route: PushNotificationRoutes },
  { path: '/skin-condition', route: SkinConditionRoutes },
  { path: '/product', route: ProductRoutes },
  { path: '/add-routine', route: AddRoutineRoutes },
  { path: '/photo-progress', route: PhotoProgessRoutes },
  { path: '/dashboard', route: DashboardRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
