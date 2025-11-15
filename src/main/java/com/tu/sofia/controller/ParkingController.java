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
                .map(this::toHomeDto)
                .toList();
    }

    private ParkingHomeDTO toHomeDto(ParkingEntity e) {
//        int freeSpaces = parkingRepository.countFreeSpacesForParking(e.getId()); // какъвто ти е методът

        return new ParkingHomeDTO()
                .setId(e.getId())
                .setName(e.getName())
                .setCity(e.getCity())
                .setAddress(e.getAddress())
                .setSpacesCount(e.getSpacesCount())
                .setFreeSpaces(e.getSpacesCount())
                .setPricePerHourBgn(e.getPricePerHourBgn())
                .setCardPaymentEnabled(Boolean.TRUE.equals(e.getCardPaymentEnabled()))
                .setLoyaltyEnabled(Boolean.TRUE.equals(e.getLoyaltyEnabled()))
                .setLoyaltyVisitPerPoint(e.getLoyaltyVisitPerPoint())
                .setLoyaltyPointsRequired(e.getLoyaltyPointsRequired())
                .setLoyaltyRewardHours(e.getLoyaltyRewardHours())
                .setMapImageUrl(e.getMapImageUrl())
                .setOpen24Hours(Boolean.TRUE.equals(e.getOpen24Hours()))
                .setOpeningTime(e.getOpeningTime())
                .setClosingTime(e.getClosingTime())
                .setContactPhone(e.getContactPhone());
    }
}
