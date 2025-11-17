package com.tu.sofia.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class LoyaltyRedemptionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private UserEntity user;

    @ManyToOne(optional = false)
    private ParkingEntity parking;

    private Integer pointsUsed;

    private Integer rewardHours;

    private LocalDateTime usedAt;

    public Long getId() {
        return id;
    }

    public LoyaltyRedemptionEntity setId(Long id) {
        this.id = id;
        return this;
    }

    public UserEntity getUser() {
        return user;
    }

    public LoyaltyRedemptionEntity setUser(UserEntity user) {
        this.user = user;
        return this;
    }

    public ParkingEntity getParking() {
        return parking;
    }

    public LoyaltyRedemptionEntity setParking(ParkingEntity parking) {
        this.parking = parking;
        return this;
    }

    public Integer getPointsUsed() {
        return pointsUsed;
    }

    public LoyaltyRedemptionEntity setPointsUsed(Integer pointsUsed) {
        this.pointsUsed = pointsUsed;
        return this;
    }

    public Integer getRewardHours() {
        return rewardHours;
    }

    public LoyaltyRedemptionEntity setRewardHours(Integer rewardHours) {
        this.rewardHours = rewardHours;
        return this;
    }

    public LocalDateTime getUsedAt() {
        return usedAt;
    }

    public LoyaltyRedemptionEntity setUsedAt(LocalDateTime usedAt) {
        this.usedAt = usedAt;
        return this;
    }
}
