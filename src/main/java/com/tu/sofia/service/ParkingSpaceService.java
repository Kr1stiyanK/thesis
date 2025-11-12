package com.tu.sofia.service;

import com.tu.sofia.model.ParkingSpaceEntity;
import com.tu.sofia.repositories.ParkingSpaceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ParkingSpaceService {

    private final ParkingSpaceRepository parkingSpaceRepository;

    public ParkingSpaceService(ParkingSpaceRepository parkingSpaceRepository) {
        this.parkingSpaceRepository = parkingSpaceRepository;
    }

    public Iterable<ParkingSpaceEntity> getAllParkingSpaces() {
        return parkingSpaceRepository.findAll();
    }

    public List<ParkingSpaceEntity> getFreeNow() {
        return parkingSpaceRepository.findFreeAt(LocalDateTime.now());
    }

    public long countFreeNow() {
        return getFreeNow().size();
    }
}
