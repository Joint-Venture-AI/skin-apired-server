import { IProgress } from './photoProgess.interface';
import { PhotoProgess } from './photoProgess.model';
import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from 'date-fns';

const createPhotoProgress = async (data: IProgress) => {
  const date = new Date();
  data.date = date.toDateString();

  const photoProgress = await PhotoProgess.create(data);
  return photoProgress;
};

const getPhotoProgressTimeLine = async (
  id: string,
  query: Record<string, unknown>
) => {
  const { page, limit } = query;

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Get earliest date (convert string -> Date)
  const firstPhoto = await PhotoProgess.findOne({ user: id })
    .sort({ date: 1 })
    .lean();
  const firstDate = firstPhoto ? new Date(firstPhoto.date) : null;

  const result = await PhotoProgess.find({ user: id })
    .sort({ date: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  // Add label field
  const labeledResult = result.map(item => {
    if (!firstDate) return { ...item, label: null };

    const currentDate = new Date(item.date);
    const daysDiff = differenceInDays(currentDate, firstDate);

    if (daysDiff < 7) {
      return { ...item, label: `Day ${daysDiff + 1}` };
    } else if (daysDiff < 30) {
      const weeks = differenceInWeeks(currentDate, firstDate);
      return { ...item, label: `${weeks} Week${weeks > 1 ? 's' : ''}` };
    } else {
      const months = differenceInMonths(currentDate, firstDate);
      return { ...item, label: `${months} Month${months > 1 ? 's' : ''}` };
    }
  });

  const total = await PhotoProgess.countDocuments({ user: id });

  return {
    result: labeledResult,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
};

const getAllPhoto = async (user: string, query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const anyConditions: any[] = [];

  if (searchTerm) {
    anyConditions.push({
      $or: [{ type: { $regex: searchTerm, $options: 'i' } }],
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  anyConditions.push({ user });

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await PhotoProgess.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const total = await PhotoProgess.countDocuments(whereConditions);

  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
  return data;
};

export const PhotoProgessService = {
  createPhotoProgress,
  getPhotoProgressTimeLine,
  getAllPhoto,
};
