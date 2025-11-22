class Api::V1::AppointmentsController < ApplicationController
  before_action :set_appointment, only: %i[ show update destroy ]

  def index
    @appointments = Appointment.all
    render json: @appointments, include: { doctor: { include: :specialty }, patient: {} }
  end

  def show
    render json: @appointment
  end

  def create
    # Find or create patient
    patient = Patient.find_or_create_by(
      name: params[:patient_name],
      surname: params[:patient_surname]
    )

    # Calculate end_time (assuming 30 min duration)
    start_time = DateTime.parse(params[:appointment_date])
    end_time = start_time + 30.minutes

    @appointment = Appointment.new(
      doctor_id: params[:doctor_id],
      patient: patient,
      start_time: start_time,
      end_time: end_time
    )

    if @appointment.save
      render json: @appointment, status: :created
    else
      render json: @appointment.errors, status: :unprocessable_entity
    end
  end

  def update
    if @appointment.update(appointment_params)
      render json: @appointment
    else
      render json: @appointment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @appointment.destroy!
  end

  private
    def set_appointment
      @appointment = Appointment.find(params[:id])
    end

    def appointment_params
      params.permit(:doctor_id, :patient_name, :patient_surname, :appointment_date, :specialization_id)
    end
end
