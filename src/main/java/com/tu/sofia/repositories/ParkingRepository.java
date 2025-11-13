package com.tu.sofia.repositories;

import com.tu.sofia.model.ParkingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingRepository extends JpaRepository<ParkingEntity, Long> {

    List<ParkingEntity> findByOwnerId(Long ownerId);
}
