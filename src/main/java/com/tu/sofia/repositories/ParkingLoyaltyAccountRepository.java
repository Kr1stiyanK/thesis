package com.tu.sofia.repositories;

import com.tu.sofia.model.ParkingLoyaltyAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParkingLoyaltyAccountRepository extends JpaRepository<ParkingLoyaltyAccountEntity, Long> {

    Optional<ParkingLoyaltyAccountEntity> findByUserIdAndParkingId(Long userId, Long parkingId);

}
