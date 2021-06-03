import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  userData: User;
  token: string;
}

class AuthenticateUserService {
  public async excute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const userData = await usersRepository.findOne({ where: { email } });

    if (!userData) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await compare(password, userData.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: userData.id,
      expiresIn,
    });

    return { userData, token };
  }
}

export default AuthenticateUserService;
