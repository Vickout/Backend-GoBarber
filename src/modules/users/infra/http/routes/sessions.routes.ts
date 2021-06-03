import { Router } from 'express';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const usersRepository = new UsersRepository();
  const authenticateUser = new AuthenticateUserService(usersRepository);

  const { userData, token } = await authenticateUser.excute({
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
});

export default sessionsRouter;
