import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import Appointment from '../../typeorm/entities/Appointment';

export default class AppointmentsController {
  public async create(
    request: Request,
    response: Response,
  ): Promise<Response | undefined> {
    const { provider_id, date } = request.body;
    const user_id = request.user.id;
    let appointment = {} as Appointment;
    try {
      const createAppointment = container.resolve(CreateAppointmentService);

      appointment = await createAppointment.execute({
        date,
        user_id,
        provider_id,
      });

      // return response.json(appointment);
    } catch (error) {
      console.log(error);
    }

    return response.json(appointment);
  }
}
