# Clear existing data to avoid duplicates
Appointment.destroy_all
Doctor.destroy_all
Specialty.destroy_all

# Create Specialties
cardiology = Specialty.create!(name: 'Kardiyoloji')
internal_medicine = Specialty.create!(name: 'Dahiliye')
ophthalmology = Specialty.create!(name: 'Göz Hastalıkları')
orthopedics = Specialty.create!(name: 'Ortopedi')
neurology = Specialty.create!(name: 'Nöroloji')
dermatology = Specialty.create!(name: 'Cildiye')

# Create Doctors
Doctor.create!(name: 'Dr. Ahmet Yılmaz', specialty: cardiology)
Doctor.create!(name: 'Dr. Ayşe Demir', specialty: cardiology)
Doctor.create!(name: 'Dr. Mehmet Kaya', specialty: internal_medicine)
Doctor.create!(name: 'Dr. Fatma Çelik', specialty: internal_medicine)
Doctor.create!(name: 'Dr. Ali Vural', specialty: ophthalmology)
Doctor.create!(name: 'Dr. Zeynep Şahin', specialty: orthopedics)
Doctor.create!(name: 'Dr. Burak Can', specialty: neurology)
Doctor.create!(name: 'Dr. Elif Öztürk', specialty: dermatology)

puts "Seed data created successfully!"
