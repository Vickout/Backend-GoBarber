import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { userData, token } = await authenticateUser.execute({
      email,
      password,
    });

    const user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    };

    return response.json({ user, token });
  }
}
