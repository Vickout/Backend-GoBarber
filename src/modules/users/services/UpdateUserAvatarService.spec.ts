import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepostiory from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepostiory;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepostiory();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });
  it('should be able to update user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Santos Dumont',
      email: 'asd@aeronauta.com',
      password: '14-bis',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: '#avatar.jpg',
    });

    expect(user.avatar).toBe('#avatar.jpg');
  });

  it('should not be able to update user avatar from a non exising user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: '#avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Santos Dumont',
      email: 'asd@aeronauta.com',
      password: '14-bis',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: '#avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: '#avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('#avatar.jpg');
    expect(user.avatar).toBe('#avatar2.jpg');
  });
});
