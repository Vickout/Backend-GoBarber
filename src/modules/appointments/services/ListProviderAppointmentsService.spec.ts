import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProvidersAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider-test-id',
      user_id: 'user-id-test',
      date: new Date(2021, 11, 10, 13, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider-test-id',
      user_id: 'user-id-test',
      date: new Date(2021, 11, 10, 14, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 11, 10, 11).getTime();
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider-test-id',
      year: 2021,
      month: 12,
      day: 10,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
