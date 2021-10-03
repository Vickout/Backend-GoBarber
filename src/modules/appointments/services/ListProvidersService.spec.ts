import FakeUsersRepostiory from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepostiory;
let listProviders: ListProvidersService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepostiory();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Santos Dumont',
      email: 'asd@aeronauta.com',
      password: '14-bis',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Carlos Drummond',
      email: 'carlinhos@literato.com',
      password: 'world-feelings',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Tom Jobim',
      email: 'tom@cantor.com',
      password: 'the-girl-from-ipanema',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
