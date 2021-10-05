import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability from providers', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user-test-id',
      user_id: 'user-id-test',
      date: new Date(2021, 11, 10, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user-test-id',
      user_id: 'user-id-test',
      date: new Date(2021, 11, 10, 14, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 11, 10, 11).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user-test-id',
      year: 2021,
      month: 12,
      day: 10,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 12, available: true },
        { hour: 13, available: false },
        { hour: 14, available: false },
        { hour: 16, available: true },
      ]),
    );
  });
});
