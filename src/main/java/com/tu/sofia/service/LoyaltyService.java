package com.tu.sofia.service;

import com.tu.sofia.dto.LoyaltySummaryDTO;
import com.tu.sofia.enums.LoyaltyRewardHours;
import com.tu.sofia.model.LoyaltyRedemptionEntity;
import com.tu.sofia.model.ParkingEntity;
import com.tu.sofia.model.UserEntity;
import com.tu.sofia.repositories.LoyaltyRedemptionRepository;
import com.tu.sofia.repositories.ParkingBookingRepository;
import com.tu.sofia.repositories.ParkingRepository;
import com.tu.sofia.repositories.UserEntityRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class LoyaltyService {

    private final ParkingRepository parkingRepo;
    private final ParkingBookingRepository bookingRepo;
    private final LoyaltyRedemptionRepository redemptionRepo;
    private final UserEntityRepository userRepo;

    public LoyaltyService(ParkingRepository parkingRepo,
                          ParkingBookingRepository bookingRepo,
                          LoyaltyRedemptionRepository redemptionRepo,
                          UserEntityRepository userRepo) {
        this.parkingRepo = parkingRepo;
        this.bookingRepo = bookingRepo;
        this.redemptionRepo = redemptionRepo;
        this.userRepo = userRepo;
    }

    public LoyaltySummaryDTO getSummaryForParking(Long userId, Long parkingId) {
        ParkingEntity p = parkingRepo.findById(parkingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking not found"));

        LoyaltySummaryDTO dto = new LoyaltySummaryDTO()
                .setParkingId(parkingId)
                .setParkingName(p.getName());

        if (!Boolean.TRUE.equals(p.getLoyaltyEnabled())) {
            dto.setLoyaltyEnabled(false);
            dto.setPoints(0);
            dto.setPointsRequired(null);
            dto.setRewardHours(null);
            dto.setPointsToNextReward(null);
            dto.setCanUseBonus(false);
            return dto;
        }

        dto.setLoyaltyEnabled(true);
        dto.setPointsRequired(p.getLoyaltyPointsRequired());
        dto.setRewardHours(mapRewardHours(p.getLoyaltyRewardHours()));
        dto.setVisitsPerPoint(p.getLoyaltyVisitPerPoint());

        // колко резервации има user-а за този паркинг
        long visits = bookingRepo.countByParkingIdAndUserId(parkingId, userId);
        int visitsPerPoint = p.getLoyaltyVisitPerPoint() != null ? p.getLoyaltyVisitPerPoint() : 1;
        int totalPointsFromVisits = (int) (visits / visitsPerPoint);

        // колко бонуса вече са използвани
        long redemptions = redemptionRepo.countByUserIdAndParkingId(userId, parkingId);
        int pointsSpent = (int) (redemptions * (long) p.getLoyaltyPointsRequired());
        int currentPoints = Math.max(0, totalPointsFromVisits - pointsSpent);

        dto.setPoints(currentPoints);

        if (currentPoints >= p.getLoyaltyPointsRequired()) {
            dto.setCanUseBonus(true);
            dto.setPointsToNextReward(0);
        } else {
            dto.setCanUseBonus(false);
            dto.setPointsToNextReward(p.getLoyaltyPointsRequired() - currentPoints);
        }

        return dto;
    }

    /**
     * Записваме, че user е използвал бонус за даден паркинг.
     * НЕ изчисляваме точки тук – те се смятат от резервациите и броя redemption-и.
     */
    public void consumeReward(Long userId, Long parkingId) {
        ParkingEntity p = parkingRepo.findById(parkingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking not found"));

        LoyaltySummaryDTO summary = getSummaryForParking(userId, parkingId);
        if (!summary.isLoyaltyEnabled() || !summary.isCanUseBonus()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough points for bonus");
        }

        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        LoyaltyRedemptionEntity redemption = new LoyaltyRedemptionEntity()
                .setUser(user)
                .setParking(p)
                .setPointsUsed(p.getLoyaltyPointsRequired())
                .setRewardHours(mapRewardHours(p.getLoyaltyRewardHours()))
                .setUsedAt(LocalDateTime.now());

        redemptionRepo.save(redemption);
    }

    private int mapRewardHours(LoyaltyRewardHours rewardHoursEnum) {
        if (rewardHoursEnum == null) {
            return 0;
        }
        return switch (rewardHoursEnum) {
            case ONE_HOUR -> 1;
            case THREE_HOURS -> 3;
            case SIX_HOURS -> 6;
            case EIGHT_HOURS -> 8;
        };
    }
}
