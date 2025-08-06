import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { sendNotifications } from '../../../helpers/notificationHelper';
import unlinkFile from '../../../shared/unlinkFile';

const createUserFromDb = async (payload: IUser) => {
  if (payload.role && payload.role === USER_ROLES.ADMIN) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You cannot create an Admin user from this route.'
    );
  }

  if (payload.verified === true) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot create a verified user directly.'
    );
  }
  payload.role = USER_ROLES.USER;

  const newUser = await User.create(payload);
  if (!newUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User couldn't be created");
  }

  const otp = generateOTP();
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 30 * 60 * 1000),
  };

  const emailContent = emailTemplate.createAccount({
    name: newUser.firstName + ' ' + newUser.lastName,
    otp,
    email: newUser.email,
  });
  emailHelper.sendEmail(emailContent);

  const updatedUser = await User.findByIdAndUpdate(
    newUser._id,
    { authentication },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Failed to update authentication info'
    );
  }

  if (updatedUser) {
    await sendNotifications({
      text: `Registered successfully, ${updatedUser.firstName} ${updatedUser.lastName}`,
      type: 'ADMIN',
    });
  }

  return updatedUser;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const anyConditions: any[] = [];
  if (searchTerm) {
    anyConditions.push({
      $or: [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

  anyConditions.push({
    role: { $ne: USER_ROLES.ADMIN },
  });

  if (Object.keys(filterData).length) {
    anyConditions.push({
      $or: Object.entries(filterData).map(([key, value]) => ({
        [key]: { $regex: value, $options: 'i' },
      })),
    });
  }

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  const pageAsNumber = Number(page) || 1;
  const limitAsNumber = Number(limit) || 10;
  const skip = (pageAsNumber - 1) * limitAsNumber;

  const sortCondition: { [key: string]: SortOrder } = { createdAt: -1 };

  const result = await User.find(whereConditions)
    .sort(sortCondition)
    .skip(skip)
    .limit(limitAsNumber)
    .lean();
  const total = await User.countDocuments(whereConditions);

  return {
    meta: {
      page: pageAsNumber,
      limit: limitAsNumber,
      total,
    },
    data: result,
  };
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (payload.image && isExistUser.image) {
    unlinkFile(isExistUser.image as string);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

export const UserService = {
  createUserFromDb,
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUsers,
  getSingleUser,
};
