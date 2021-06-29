// import AppError from '@shared/errors/AppError';
import FakeUsersRepostiory from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepostiory from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepostiory;
let fakeUserTokensRepository: FakeUserTokensRepostiory;
let resetPassword: ResetPasswordService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepostiory();
    fakeUserTokensRepository = new FakeUserTokensRepostiory();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );
  });

  it('should be able to reset password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Santos Dumont',
      email: 'asd@aeronauta.com',
      password: '14-bis',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPassword.execute({
      token,
      password: '123123',
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.id).toBe('123123');
  });
});
