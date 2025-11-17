package com.tu.sofia.repositories;

import com.tu.sofia.model.LoyaltyRedemptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoyaltyRedemptionRepository extends JpaRepository<LoyaltyRedemptionEntity, Long> {
    long countByUserIdAndParkingId(Long userId, Long parkingId);
}
