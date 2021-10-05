import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepostiory from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepostiory;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepostiory();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      user_id: 'user-id-test',
      provider_id: '1234123412',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1234123412');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date();

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
});
