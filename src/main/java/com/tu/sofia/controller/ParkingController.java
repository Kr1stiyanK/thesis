package com.tu.sofia.controller;

import com.tu.sofia.dto.ParkingHomeDTO;
import com.tu.sofia.model.ParkingEntity;
import com.tu.sofia.repositories.ParkingRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/parkings")
@CrossOrigin(origins = "http://localhost:4200")
public class ParkingController {

    private final ParkingRepository parkingRepository;

    public ParkingController(ParkingRepository parkingRepository) {
        this.parkingRepository = parkingRepository;
    }


    @GetMapping
    public List<ParkingHomeDTO> getAllForHomePage() {
        List<ParkingEntity> parkingEntities = parkingRepository.findAll();
        return parkingEntities.stream()
                .map(p -> new ParkingHomeDTO()
                        .setId(p.getId())
                        .setName(p.getName())
                        .setAddress(p.getAddress())
                        .setFreeSpaces(p.getSpacesCount())
                        .setPricePerHourBgn(p.getPricePerHourBgn())).toList();
    }
}
