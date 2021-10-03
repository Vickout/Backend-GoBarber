import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepostiory from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepostiory;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepostiory();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Santos Dumont',
      email: 'asd@aeronauta.com',
      password: '14-bis',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Carlos Drummond',
      email: 'carlinhos@literato.com',
    });

    expect(updatedUser.name).toBe('Carlos Drummond');
    expect(updatedUser.email).toBe('carlinhos@literato.com');
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Carlos Drummond',
        email: 'carlinhos@literato.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Santos Dumont',
      email: 'asd@aeronauta.com',
      password: '14-bis',
    });

    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste@exemple.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Santos Dumont',
        email: 'asd@aeronauta.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Santos Dumont',
      email: 'asd@aeronauta.com',
      password: '14-bis',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Carlos Drummond',
      email: 'carlinhos@literato.com',
      old_password: '14-bis',
      password: 'world-feelings',
    });

    expect(updatedUser.password).toBe('world-feelings');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Santos Dumont',
      email: 'asd@aeronauta.com',
      password: '14-bis',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Carlos Drummond',
        email: 'carlinhos@literato.com',
        password: 'world-feelings',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Santos Dumont',
      email: 'asd@aeronauta.com',
      password: '14-bis',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Carlos Drummond',
        email: 'carlinhos@literato.com',
        old_password: '0-alienista',
        password: 'world-feelings',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
