import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepostiory from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepostiory;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepostiory();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });
  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Santos Dumont',
      email: 'asd@aeronauta.com',
      password: '14-bis',
    });

    expect(user).toHaveProperty('id');
  });

  it('should be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'Santos Dumont',
      email: 'asd@aeronauta.com',
      password: '14-bis',
    });

    await expect(
      createUser.execute({
        name: 'Santos Dumont',
        email: 'asd@aeronauta.com',
        password: '14-bis',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
