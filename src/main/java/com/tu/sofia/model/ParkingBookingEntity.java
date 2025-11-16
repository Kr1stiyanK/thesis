package com.tu.sofia.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "parking_booking")
public class ParkingBookingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_id")
    private ParkingEntity parking;

    @Column(name = "space_number", nullable = false)
    private Integer spaceNumber;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amountBgn;

    @ManyToOne
    private UserEntity user;

    public Long getId() {
        return id;
    }

    public ParkingBookingEntity setId(Long id) {
        this.id = id;
        return this;
    }

    public ParkingEntity getParking() {
        return parking;
    }

    public ParkingBookingEntity setParking(ParkingEntity parking) {
        this.parking = parking;
        return this;
    }

    public Integer getSpaceNumber() {
        return spaceNumber;
    }

    public ParkingBookingEntity setSpaceNumber(Integer spaceNumber) {
        this.spaceNumber = spaceNumber;
        return this;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public ParkingBookingEntity setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
        return this;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public ParkingBookingEntity setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
        return this;
    }

    public BigDecimal getAmountBgn() {
        return amountBgn;
    }

    public ParkingBookingEntity setAmountBgn(BigDecimal amountBgn) {
        this.amountBgn = amountBgn;
        return this;
    }

    public UserEntity getUser() {
        return user;
    }

    public ParkingBookingEntity setUser(UserEntity user) {
        this.user = user;
        return this;
    }
}
