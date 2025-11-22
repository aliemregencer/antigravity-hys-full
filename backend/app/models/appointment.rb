class Appointment < ApplicationRecord
  belongs_to :doctor
  belongs_to :patient

  validates :start_time, presence: true
  validates :end_time, presence: true
  validate :no_overlap

  private

  def no_overlap
    return unless start_time && end_time

    if Appointment.where(doctor_id: doctor_id)
                  .where.not(id: id)
                  .where("start_time < ? AND end_time > ?", end_time, start_time)
                  .exists?
      errors.add(:base, "Doctor already has an appointment in this time slot")
    end
  end
end
