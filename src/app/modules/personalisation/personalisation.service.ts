import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IPersonalisation } from './personalisation.interface';
import { Personalisation } from './personalisation.model';

const createPersonalisation = async (payload: IPersonalisation) => {
  const newPersonalisation = await Personalisation.create(payload);
  if (!newPersonalisation) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Personalisation couldn't be created"
    );
  }

  return newPersonalisation;
};

export const PersonalisationService = {
  createPersonalisation,
};
