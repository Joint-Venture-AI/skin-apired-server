import { Product } from '../product/product.model';
import { SkinCondition } from '../skinCondition/skinCondition.model';
import { User } from '../user/user.model';

const getDashboardStatistics = async () => {
  const [totalUsers, totalSkinConditions, totalProducts] = await Promise.all([
    User.countDocuments(),
    SkinCondition.countDocuments(),
    Product.countDocuments(),
  ]);

  return { totalUsers, totalSkinConditions, totalProducts };
};

export const DashboardService = {
  getDashboardStatistics,
};
