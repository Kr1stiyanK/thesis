package com.tu.sofia.service;

import com.tu.sofia.dto.ParkingCreateRequestDTO;
import com.tu.sofia.model.ParkingEntity;
import com.tu.sofia.repositories.ParkingRepository;
import com.tu.sofia.repositories.ParkingSpaceBookingRepository;
import com.tu.sofia.repositories.ParkingSpaceRepository;
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

    public ParkingEntity createParking(Long ownerId, ParkingCreateRequestDTO requestDTO) {
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
}
