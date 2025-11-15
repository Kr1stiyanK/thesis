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
        validateWorkingHours(requestDTO);

        ParkingEntity parkingEntity = new ParkingEntity()
                .setName(requestDTO.getName())
                .setAddress(requestDTO.getAddress())
                .setCity(requestDTO.getCity())
                .setSpacesCount(requestDTO.getSpacesCount())
                .setPricePerHourBgn(requestDTO.getPricePerHourBgn())
                .setCardPaymentEnabled(Boolean.TRUE.equals(requestDTO.getCardPaymentEnabled()))
                .setLoyaltyEnabled(Boolean.TRUE.equals(requestDTO.getLoyaltyEnabled()))
                .setLoyaltyVisitPerPoint(requestDTO.getLoyaltyVisitPerPoint())
                .setLoyaltyPointsRequired(requestDTO.getLoyaltyPointsRequired())
                .setLoyaltyRewardHours(requestDTO.getLoyaltyRewardHours())
                .setMapImageUrl(requestDTO.getMapImageUrl())
                .setOpen24Hours(Boolean.TRUE.equals(requestDTO.getOpen24Hours()))
                .setOpeningTime(requestDTO.getOpeningTime())
                .setClosingTime(requestDTO.getClosingTime())
                .setContactPhone(requestDTO.getContactPhone())
                .setOwnerId(ownerId);

        if (Boolean.TRUE.equals(parkingEntity.getOpen24Hours())) {
            parkingEntity.setOpeningTime(null).setClosingTime(null);
        }

        return parkingRepository.save(parkingEntity);
    }

    public ParkingEntity updateParking(Long ownerId, Long parkingId, ParkingRequestDTO requestDTO) {
        validateWorkingHours(requestDTO);
        ParkingEntity adminParking = findAndValidateAdminParking(ownerId, parkingId);

        adminParking
                .setName(requestDTO.getName())
                .setAddress(requestDTO.getAddress())
                .setCity(requestDTO.getCity())
                .setSpacesCount(requestDTO.getSpacesCount())
                .setPricePerHourBgn(requestDTO.getPricePerHourBgn())
                .setCardPaymentEnabled(Boolean.TRUE.equals(requestDTO.getCardPaymentEnabled()))
                .setLoyaltyEnabled(Boolean.TRUE.equals(requestDTO.getLoyaltyEnabled()))
                .setLoyaltyVisitPerPoint(requestDTO.getLoyaltyVisitPerPoint())
                .setLoyaltyPointsRequired(requestDTO.getLoyaltyPointsRequired())
                .setLoyaltyRewardHours(requestDTO.getLoyaltyRewardHours())
                .setMapImageUrl(requestDTO.getMapImageUrl())
                .setOpen24Hours(Boolean.TRUE.equals(requestDTO.getOpen24Hours()))
                .setOpeningTime(requestDTO.getOpeningTime())
                .setClosingTime(requestDTO.getClosingTime())
                .setContactPhone(requestDTO.getContactPhone());

        if (Boolean.TRUE.equals(adminParking.getOpen24Hours())) {
            adminParking.setOpeningTime(null).setClosingTime(null);
        }

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

    private void validateWorkingHours(ParkingRequestDTO dto) {
        if (Boolean.TRUE.equals(dto.getOpen24Hours())) {
            return;
        }

        if (dto.getOpeningTime() == null || dto.getClosingTime() == null) {
            throw new RuntimeException("Opening and closing time must be provided.");
        }

        if (!dto.getOpeningTime().isBefore(dto.getClosingTime())) {
            throw new RuntimeException("Opening time must be before closing time.");
        }
    }


}
