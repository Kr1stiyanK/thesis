package com.tu.sofia.service;

import com.tu.sofia.dto.ParkingRequestDTO;
import com.tu.sofia.model.ParkingEntity;
import com.tu.sofia.repositories.ParkingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingService {
    //    private final ParkingSpaceRepository parkingSpaceRepository;
    private final ParkingRepository parkingRepository;
//    private final ParkingSpaceBookingRepository parkingSpaceBookingRepository;

//    public ParkingService(ParkingSpaceRepository parkingSpaceRepository, ParkingRepository parkingRepository, ParkingSpaceBookingRepository parkingSpaceBookingRepository) {
//        this.parkingSpaceRepository = parkingSpaceRepository;
//        this.parkingRepository = parkingRepository;
//        this.parkingSpaceBookingRepository = parkingSpaceBookingRepository;
//    }


    public ParkingService(ParkingRepository parkingRepository) {
        this.parkingRepository = parkingRepository;
    }

    public List<ParkingEntity> getParkingsByOwnerId(Long ownerId) {
        return parkingRepository.findByOwnerId(ownerId);
    }

    public ParkingEntity createParking(Long ownerId, ParkingRequestDTO requestDTO) {
        ParkingEntity parkingEntity = new ParkingEntity()
                .setName(requestDTO.getName())
                .setAddress(requestDTO.getAddress())
                .setSpacesCount(requestDTO.getSpacesCount())
                .setPricePerHourBgn(requestDTO.getPricePerHourBgn())
                .setCardPaymentEnabled(Boolean.TRUE.equals(requestDTO.getCardPaymentEnabled()))
                .setLoyaltyEnabled(Boolean.TRUE.equals(requestDTO.getLoyaltyEnabled()))
                .setLoyaltyVisitPerPoint(requestDTO.getLoyaltyVisitPerPoint())
                .setLoyaltyPointsRequired(requestDTO.getLoyaltyPointsRequired())
                .setLoyaltyRewardHours(requestDTO.getLoyaltyRewardHours())
                .setMapImageUrl(requestDTO.getMapImageUrl())
                .setOwnerId(ownerId);

        return parkingRepository.save(parkingEntity);
    }

    public ParkingEntity updateParking(Long ownerId, Long parkingId, ParkingRequestDTO requestDTO) {
        ParkingEntity adminParking = findAndValidateAdminParking(ownerId, parkingId);

        adminParking
                .setName(requestDTO.getName())
                .setAddress(requestDTO.getAddress())
                .setSpacesCount(requestDTO.getSpacesCount())
                .setPricePerHourBgn(requestDTO.getPricePerHourBgn())
                .setCardPaymentEnabled(Boolean.TRUE.equals(requestDTO.getCardPaymentEnabled()))
                .setLoyaltyEnabled(Boolean.TRUE.equals(requestDTO.getLoyaltyEnabled()))
                .setLoyaltyVisitPerPoint(requestDTO.getLoyaltyVisitPerPoint())
                .setLoyaltyPointsRequired(requestDTO.getLoyaltyPointsRequired())
                .setLoyaltyRewardHours(requestDTO.getLoyaltyRewardHours())
                .setMapImageUrl(requestDTO.getMapImageUrl());

        return parkingRepository.save(adminParking);
    }


    public void deleteParking(Long ownerId, Long parkingId) {
        ParkingEntity adminParking = findAndValidateAdminParking(ownerId, parkingId);
        parkingRepository.delete(adminParking);
    }


    private ParkingEntity findAndValidateAdminParking(Long ownerId, Long parkingId) {
        ParkingEntity existingParking = this.parkingRepository.findById(parkingId).orElseThrow(() -> new RuntimeException("Parking not found"));
        if (!existingParking.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("This is not your parking");
        }
        return existingParking;
    }

}
