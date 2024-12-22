package org.example.gestionvaccination.controller;

import org.example.gestionvaccination.entity.Appointment;
import org.example.gestionvaccination.entity.Vaccine;
import org.example.gestionvaccination.repository.AppointmentRepository;
import org.example.gestionvaccination.repository.VaccineRepository;
import org.example.gestionvaccination.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private VaccineRepository vaccineRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        Vaccine vaccine = vaccineRepository.findById(appointment.getVaccine().getId())
                .orElseThrow(() -> new RuntimeException("Vaccine not found"));

        appointment.setVaccine(vaccine);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return ResponseEntity.ok(savedAppointment);
    }


    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment updatedAppointment) {
        Optional<Appointment> existingAppointmentOpt = appointmentRepository.findById(id);

        if (existingAppointmentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Appointment existingAppointment = existingAppointmentOpt.get();

        existingAppointment.setPatientName(updatedAppointment.getPatientName());
        existingAppointment.setStatus(updatedAppointment.getStatus());
        existingAppointment.setAppointmentDate(updatedAppointment.getAppointmentDate());

        if (updatedAppointment.getVaccine() != null) {
            Vaccine vaccine = vaccineRepository.findById(updatedAppointment.getVaccine().getId())
                    .orElseThrow(() -> new RuntimeException("Vaccine not found"));
            existingAppointment.setVaccine(vaccine);
        }

        Appointment savedAppointment = appointmentRepository.save(existingAppointment);

        return ResponseEntity.ok(savedAppointment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
