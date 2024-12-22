package org.example.gestionvaccination.service;

import org.example.gestionvaccination.entity.Vaccine;
import org.example.gestionvaccination.repository.VaccineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VaccineService {

    @Autowired
    private VaccineRepository vaccineRepository;

    public Vaccine saveVaccine(Vaccine vaccine) {
        return vaccineRepository.save(vaccine);
    }

    public List<Vaccine> getAllVaccines() {
        return vaccineRepository.findAll();
    }

    public Optional<Vaccine> getVaccineById(Long id) {
        return vaccineRepository.findById(id);
    }

    public void deleteVaccine(Long id) {
        vaccineRepository.deleteById(id);
    }
}
