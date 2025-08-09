import { IProgress } from './photoProgess.interface';
import { PhotoProgess } from './photoProgess.model';

const createPhotoProgress = async (data: IProgress) => {
  const date = new Date();
  data.date = date.toDateString();

  console.log(date.toDateString());

  const photoProgress = await PhotoProgess.create(data);
  return photoProgress;
};

export const PhotoProgessService = {
  createPhotoProgress,
};
