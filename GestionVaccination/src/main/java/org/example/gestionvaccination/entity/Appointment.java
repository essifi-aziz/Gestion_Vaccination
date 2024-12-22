package org.example.gestionvaccination.entity;

import jakarta.persistence.*;  // Use this for validation
import java.time.LocalDateTime;

@Entity  // Optional: can define table name if it's different from class name
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_name")
    private String patientName;

    @ManyToOne
    @JoinColumn(name = "vaccine_id", nullable = false)
    private Vaccine vaccine;

    @Column(name = "appointment_date")
    private LocalDateTime appointmentDate;

    private String status;

    // Default constructor
    public Appointment() {
    }

    // Constructor with parameters excluding id
    public Appointment(String patientName, Vaccine vaccine, LocalDateTime appointmentDate, String status) {
        this.patientName = patientName;
        this.vaccine = vaccine;
        this.appointmentDate = appointmentDate;
        this.status = status;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Vaccine getVaccine() {
        return vaccine;
    }

    public void setVaccine(Vaccine vaccine) {
        this.vaccine = vaccine;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
