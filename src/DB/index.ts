import colors from 'colors';
import { User } from '../app/modules/user/user.model';
import config from '../config';
import { USER_ROLES } from '../enums/user';
import { logger } from '../shared/logger';
import downloadImage from '../util/file/downloadImage';

const seedAdmin = async () => {
  const image =
    'https://static.vecteezy.com/system/resources/previews/005/005/788/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg';

  const newImage = image
    ? await downloadImage(image)
    : '/public/image/placeholder.png';

  const superUser = {
    firstName: 'Admin',
    role: USER_ROLES.ADMIN,
    email: config.admin.email,
    password: config.admin.password,
    image: newImage,
    verified: true,
  };

  const isExistSuperAdmin = await User.findOne({
    role: USER_ROLES.ADMIN,
  });

  if (!isExistSuperAdmin) {
    await User.create(superUser);
    logger.info(colors.green('✔ admin created successfully!'));
  }
};

export default seedAdmin;
