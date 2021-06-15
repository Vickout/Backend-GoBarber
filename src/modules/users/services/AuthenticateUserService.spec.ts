import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepostiory from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepostiory();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Santos Dumont',
      email: 'asd@aeronauta.com',
      password: '14-bis',
    });

    const response = await authenticateUser.execute({
      email: 'asd@aeronauta.com',
      password: '14-bis',
    });

    expect(response).toHaveProperty('token');
    expect(response.userData).toEqual(user);
  });

  //   it('should be able to create a new user with same email from another', async () => {
  //     const fakeUsersRepository = new FakeUsersRepostiory();
  //     const AuthenticateUser = new AuthenticateUserService(fakeUsersRepository);

  //     await AuthenticateUser.execute({
  //       name: 'Santos Dumont',
  //       email: 'asd@aeronauta.com',
  //       password: '14-bis',
  //     });

  //     expect(
  //       AuthenticateUser.execute({
  //         name: 'Santos Dumont',
  //         email: 'asd@aeronauta.com',
  //         password: '14-bis',
  //       }),
  //     ).rejects.toBeInstanceOf(AppError);
  //   });
});
