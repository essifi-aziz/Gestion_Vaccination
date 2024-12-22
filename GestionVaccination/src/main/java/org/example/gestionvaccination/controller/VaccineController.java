package org.example.gestionvaccination.controller;

import org.example.gestionvaccination.entity.Vaccine;
import org.example.gestionvaccination.repository.VaccineRepository;
import org.example.gestionvaccination.service.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/vaccines")
public class VaccineController {

    @Autowired
    private VaccineService vaccineService;

    @Autowired
    private VaccineRepository vaccineRepository;

    @PostMapping
    public ResponseEntity<Vaccine> createVaccine(@RequestBody Vaccine vaccine) {
        Vaccine savedVaccine = vaccineService.saveVaccine(vaccine);
        return new ResponseEntity<>(savedVaccine, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Vaccine>> getAllVaccines() {
        List<Vaccine> vaccines = vaccineService.getAllVaccines();
        return new ResponseEntity<>(vaccines, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vaccine> getVaccineById(@PathVariable Long id) {
        Optional<Vaccine> vaccine = vaccineService.getVaccineById(id);
        return vaccine.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vaccine> updateVaccine(@PathVariable Long id, @RequestBody Vaccine vaccine) {
        Optional<Vaccine> existingVaccine = vaccineRepository.findById(id);

        if (!existingVaccine.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        vaccine.setId(id);

        Vaccine updatedVaccine = vaccineRepository.save(vaccine);
        return ResponseEntity.ok(updatedVaccine);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVaccine(@PathVariable Long id) {
        vaccineService.deleteVaccine(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
