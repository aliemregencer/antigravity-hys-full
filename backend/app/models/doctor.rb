class Doctor < ApplicationRecord
  belongs_to :specialty
  has_many :appointments
end
