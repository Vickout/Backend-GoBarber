import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from providers', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user-test-id',
      date: new Date(2021, 11, 10, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user-test-id',
      date: new Date(2021, 11, 10, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user-test-id',
      date: new Date(2021, 11, 10, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'user-test-id',
      date: new Date(2021, 11, 11, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'user-test-id',
      year: 2021,
      month: 10,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 9, available: true },
        { day: 10, available: false },
        { day: 11, available: true },
        { day: 12, available: true },
      ]),
    );
  });
});
