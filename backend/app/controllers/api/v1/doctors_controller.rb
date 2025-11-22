class Api::V1::DoctorsController < ApplicationController
  before_action :set_doctor, only: %i[ show update destroy ]

  def index
    if params[:specialty_id]
      @doctors = Doctor.where(specialty_id: params[:specialty_id])
    else
      @doctors = Doctor.all
    end
    render json: @doctors, include: :specialty
  end

  def show
    render json: @doctor
  end

  def create
    @doctor = Doctor.new(doctor_params)

    if @doctor.save
      render json: @doctor, status: :created
    else
      render json: @doctor.errors, status: :unprocessable_entity
    end
  end

  def update
    if @doctor.update(doctor_params)
      render json: @doctor
    else
      render json: @doctor.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @doctor.destroy!
  end

  private
    def set_doctor
      @doctor = Doctor.find(params[:id])
    end

    def doctor_params
      params.require(:doctor).permit(:name, :specialty_id)
    end
end
