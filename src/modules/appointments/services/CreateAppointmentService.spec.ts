import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 11, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2021, 11, 10, 13),
      user_id: 'user-id-test',
      provider_id: '1234123412',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1234123412');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2021, 11, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: 'user-id-test',
      provider_id: '1234123412',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: 'user-id-test',
        provider_id: '1234123412',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 11, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 11, 10, 11),
        user_id: 'user-id-test',
        provider_id: '1234123412',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 11, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 11, 10, 13),
        user_id: 'user-id-test',
        provider_id: 'user-id-test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 11, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 11, 10, 7),
        user_id: 'user-id-test',
        provider_id: 'provider-id-test',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2021, 11, 10, 18),
        user_id: 'user-id-test',
        provider_id: 'provider-id-test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
