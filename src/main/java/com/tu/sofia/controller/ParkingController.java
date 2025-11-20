package com.tu.sofia.controller;

import com.tu.sofia.dto.BookingSlotDTO;
import com.tu.sofia.dto.ParkingHomeDTO;
import com.tu.sofia.dto.ParkingScheduleMetaDTO;
import com.tu.sofia.model.ParkingEntity;
import com.tu.sofia.repositories.ParkingBookingRepository;
import com.tu.sofia.repositories.ParkingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/parkings")
@CrossOrigin(origins = "http://localhost:4200")
public class ParkingController {

    private final ParkingRepository parkingRepository;

    private final ParkingBookingRepository parkingBookingRepository;

    public ParkingController(ParkingRepository parkingRepository, ParkingBookingRepository parkingBookingRepository) {
        this.parkingRepository = parkingRepository;
        this.parkingBookingRepository = parkingBookingRepository;
    }


    @GetMapping
    public List<ParkingHomeDTO> getAllForHomePage() {
        List<ParkingEntity> parkingEntities = parkingRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        return parkingEntities.stream()
                .map(e -> toHomeDto(e, now))
                .toList();
    }

    private ParkingHomeDTO toHomeDto(ParkingEntity e, LocalDateTime now) {
        long occupiedNow = parkingBookingRepository.countActiveBookingsForParking(e.getId(), now);

        int freeSpaces = (int) Math.max(0, e.getSpacesCount() - occupiedNow);

        return new ParkingHomeDTO()
                .setId(e.getId())
                .setName(e.getName())
                .setCity(e.getCity())
                .setAddress(e.getAddress())
                .setSpacesCount(e.getSpacesCount())
                .setFreeSpaces(freeSpaces)
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

    @GetMapping("/{id}/schedule-meta")
    public ParkingScheduleMetaDTO getParkingScheduleMeta(@PathVariable Long id) {
        ParkingEntity p = parkingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking not found"));

        return new ParkingScheduleMetaDTO()
                .setId(p.getId())
                .setName(p.getName())
                .setSpacesCount(p.getSpacesCount())
                .setOpen24Hours(Boolean.TRUE.equals(p.getOpen24Hours()))
                .setOpeningTime(p.getOpeningTime())
                .setClosingTime(p.getClosingTime())
                .setPricePerHourBgn(p.getPricePerHourBgn())
                .setCardPaymentEnabled(Boolean.TRUE.equals(p.getCardPaymentEnabled()));
    }

}
