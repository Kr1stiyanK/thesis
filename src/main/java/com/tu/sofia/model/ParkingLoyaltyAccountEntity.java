package com.tu.sofia.model;

import jakarta.persistence.*;

@Entity
@Table(name = "parking_loyalty_account")
public class ParkingLoyaltyAccountEntity {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private UserEntity user;

    @ManyToOne
    private ParkingEntity parking;

    private Integer visitsCount = 0;
    private Integer points = 0;

    public Long getId() {
        return id;
    }

    public ParkingLoyaltyAccountEntity setId(Long id) {
        this.id = id;
        return this;
    }

    public UserEntity getUser() {
        return user;
    }

    public ParkingLoyaltyAccountEntity setUser(UserEntity user) {
        this.user = user;
        return this;
    }

    public ParkingEntity getParking() {
        return parking;
    }

    public ParkingLoyaltyAccountEntity setParking(ParkingEntity parking) {
        this.parking = parking;
        return this;
    }

    public Integer getVisitsCount() {
        return visitsCount;
    }

    public ParkingLoyaltyAccountEntity setVisitsCount(Integer visitsCount) {
        this.visitsCount = visitsCount;
        return this;
    }

    public Integer getPoints() {
        return points;
    }

    public ParkingLoyaltyAccountEntity setPoints(Integer points) {
        this.points = points;
        return this;
    }
}
