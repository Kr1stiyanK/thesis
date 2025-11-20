package com.tu.sofia.repositories;

import com.tu.sofia.model.ParkingBookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ParkingBookingRepository extends JpaRepository<ParkingBookingEntity, Long> {
    List<ParkingBookingEntity> findByParkingIdAndStartTimeBetween(Long parkingId, LocalDateTime dayStart, LocalDateTime dayEnd);

    List<ParkingBookingEntity> findByParkingIdAndSpaceNumberAndStartTimeLessThanAndEndTimeGreaterThan(
            Long parkingId,
            Integer spaceNumber,
            LocalDateTime newEnd,
            LocalDateTime newStart
    );

    @Query("""
            SELECT b FROM ParkingBookingEntity b
            WHERE b.parking.id = :parkingId
              AND b.startTime < :dayEnd
              AND b.endTime  > :dayStart
            """)
    List<ParkingBookingEntity> findForParkingAndDay(
            @Param("parkingId") Long parkingId,
            @Param("dayStart") LocalDateTime dayStart,
            @Param("dayEnd") LocalDateTime dayEnd
    );

    long countByParkingIdAndUserId(Long parkingId, Long userId);

    List<ParkingBookingEntity> findByUser_EmailOrderByStartTimeDesc(String email);

    List<ParkingBookingEntity> findByParkingIdOrderByStartTimeDesc(Long parkingId);

    boolean existsByParkingIdAndSpaceNumberAndStartTimeLessThanAndEndTimeGreaterThan(Long id, int space, LocalDateTime end, LocalDateTime start);

    @Query("""
            SELECT COUNT(b)
            FROM ParkingBookingEntity b
            WHERE b.parking.id = :parkingId
              AND b.startTime <= :now
              AND b.endTime > :now
            """)
    long countActiveBookingsForParking(@Param("parkingId") Long parkingId, @Param("now") LocalDateTime now);

    @Query("""
                SELECT COUNT(b)
                FROM ParkingBookingEntity b
                WHERE b.parking.id = :parkingId
                  AND b.startTime < :endTime
                  AND b.endTime > :startTime
            """)
    long countOverlappingBookings(Long parkingId, LocalDateTime startTime, LocalDateTime endTime);
}
