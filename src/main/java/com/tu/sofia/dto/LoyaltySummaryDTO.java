package com.tu.sofia.dto;

public class LoyaltySummaryDTO {

    private Long parkingId;
    private String parkingName;
    private boolean loyaltyEnabled;
    private int points;
    private Integer pointsRequired;
    private Integer rewardHours;
    private Integer pointsToNextReward;
    private boolean canUseBonus;
    private Integer visitsPerPoint;

    public Long getParkingId() {
        return parkingId;
    }

    public LoyaltySummaryDTO setParkingId(Long parkingId) {
        this.parkingId = parkingId;
        return this;
    }

    public String getParkingName() {
        return parkingName;
    }

    public LoyaltySummaryDTO setParkingName(String parkingName) {
        this.parkingName = parkingName;
        return this;
    }

    public boolean isLoyaltyEnabled() {
        return loyaltyEnabled;
    }

    public LoyaltySummaryDTO setLoyaltyEnabled(boolean loyaltyEnabled) {
        this.loyaltyEnabled = loyaltyEnabled;
        return this;
    }

    public int getPoints() {
        return points;
    }

    public LoyaltySummaryDTO setPoints(int points) {
        this.points = points;
        return this;
    }

    public Integer getPointsRequired() {
        return pointsRequired;
    }

    public LoyaltySummaryDTO setPointsRequired(Integer pointsRequired) {
        this.pointsRequired = pointsRequired;
        return this;
    }

    public Integer getRewardHours() {
        return rewardHours;
    }

    public LoyaltySummaryDTO setRewardHours(Integer rewardHours) {
        this.rewardHours = rewardHours;
        return this;
    }

    public Integer getPointsToNextReward() {
        return pointsToNextReward;
    }

    public LoyaltySummaryDTO setPointsToNextReward(Integer pointsToNextReward) {
        this.pointsToNextReward = pointsToNextReward;
        return this;
    }

    public boolean isCanUseBonus() {
        return canUseBonus;
    }

    public LoyaltySummaryDTO setCanUseBonus(boolean canUseBonus) {
        this.canUseBonus = canUseBonus;
        return this;
    }

    public Integer getVisitsPerPoint() {
        return visitsPerPoint;
    }

    public LoyaltySummaryDTO setVisitsPerPoint(Integer visitsPerPoint) {
        this.visitsPerPoint = visitsPerPoint;
        return this;
    }
}
