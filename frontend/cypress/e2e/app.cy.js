/// <reference types="cypress" />
/* global cy, describe, it, expect */
// E2E test that runs against the REAL backend at http://localhost:3000
describe('App (real backend)', () => {
  it('clears existing appointments, creates an appointment via the UI, then cancels it', () => {
    const patientName = `E2E-${Date.now()}`
    const patientSurname = 'User'

    // --- Clear only previous E2E-created appointments via API (safer) ---
    cy.request({ method: 'GET', url: 'http://localhost:3000/api/v1/appointments' }).then((resp) => {
      const apps = resp.body || []
      apps.forEach((a) => {
        const pName = a.patient?.name || ''
        if (typeof pName === 'string' && pName.startsWith('E2E-')) {
          cy.request({ method: 'DELETE', url: `http://localhost:3000/api/v1/appointments/${a.id}` })
        }
      })
    })

    // Alias network requests so we can wait for them (no stubbing)
    cy.intercept('GET', '**/specialties').as('getSpecialties')
    cy.intercept('GET', '**/doctors*').as('getDoctors')
    cy.intercept('POST', '**/appointments').as('postAppointment')
    cy.intercept('GET', '**/appointments').as('getAppointments')
    cy.intercept('DELETE', '**/appointments/*').as('deleteAppointment')

    // Visit home page (frontend hosted by Vite; cypress.config.js baseUrl should point to it)
    cy.visit('/')
    cy.wait(2000) // pause so video captures initial load

    // Wait for specializations to load
    cy.wait('@getSpecialties')
    cy.wait(2000)

    // Select first non-empty specialization option
    cy.get('select[name="specialization_id"] option').then(($opts) => {
      const first = Array.from($opts).find(o => o.value && o.value !== '')
      expect(first, 'at least one specialization option').to.exist
      cy.get('select[name="specialization_id"]').select(first.value)
    })

    // Wait for doctors to load for selected specialization
    cy.wait('@getDoctors')
    cy.wait(2000)

    // Select first doctor
    cy.get('select[name="doctor_id"] option').then(($opts) => {
      const firstDoc = Array.from($opts).find(o => o.value && o.value !== '')
      expect(firstDoc, 'at least one doctor option').to.exist
      cy.get('select[name="doctor_id"]').select(firstDoc.value)
    })
    cy.wait(2000)

    // Fill form (slowly so video captures typing)
    cy.get('input[name="patient_name"]').clear().type(patientName)
    cy.wait(500)
    cy.get('input[name="patient_surname"]').clear().type(patientSurname)
    cy.wait(2000)

    // Use a datetime-local value one day in the future
    const dt = new Date(Date.now() + 24 * 3600 * 1000)
    const pad = (n) => String(n).padStart(2, '0')
    const isoLocal = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`
    cy.get('input[name="appointment_date"]').clear().type(isoLocal)

    // Submit the form
    cy.contains('button', 'Randevu Oluştur').click()
    cy.wait(3000)

    // Wait for POST to complete and assert server returned created status
    cy.wait('@postAppointment').then((interception) => {
      expect(interception.response, 'POST /appointments response').to.exist
      expect(interception.response.statusCode).to.be.oneOf([200,201])
    })

    // Assert success message is shown in UI
    cy.contains('Randevu başarıyla oluşturuldu!', { timeout: 5000 }).should('be.visible')
    cy.wait(2000)

    // Now go to appointment list and ensure the created appointment is present
    cy.visit('/randevu/listesi')
    cy.wait('@getAppointments')
    cy.wait(2000)

    // Look for the patient name we created
    cy.contains('table tr', `${patientName} ${patientSurname}`).should('exist')
    cy.wait(2000)

    // Cancel the appointment via UI: confirm dialogs accepted automatically here
    cy.on('window:confirm', () => true)
    cy.contains('table tr', `${patientName} ${patientSurname}`).within(() => {
      cy.contains('İptal Et').click()
    })

    // Wait for delete request and assert status
    cy.wait('@deleteAppointment').then((interception) => {
      expect(interception.response).to.exist
      // allow common success codes
      expect(interception.response.statusCode).to.be.oneOf([200,202,204])
    })

    // The appointment row should no longer exist
    cy.contains('table tr', `${patientName} ${patientSurname}`).should('not.exist')
    cy.wait(5000) // final pause so video records the final UI state
  })
})
