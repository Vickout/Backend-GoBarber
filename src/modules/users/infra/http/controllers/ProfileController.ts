import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const userData = await showProfile.execute({ user_id });

    const user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    };

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    const UpdateProfile = container.resolve(UpdateProfileService);

    const userData = await UpdateProfile.execute({
      user_id,
      name,
      email,
      old_password,
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
