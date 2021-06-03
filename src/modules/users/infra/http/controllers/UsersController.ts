import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const userData = await createUser.execute({
      name,
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

    return response.json(user);
  }
}
