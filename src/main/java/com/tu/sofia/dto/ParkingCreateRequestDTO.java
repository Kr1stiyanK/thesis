package com.tu.sofia.dto;

import com.tu.sofia.enums.LoyaltyRewardHours;

import java.math.BigDecimal;

public class ParkingCreateRequestDTO {
    private String name;
    private String address;
    private Integer spacesCount;
    private BigDecimal pricePerHourBgn;
    private Boolean cardPaymentEnabled;
    private Boolean loyaltyEnabled;
    private Integer loyaltyVisitPerPoint;
    private Integer loyaltyPointsRequired;
    private LoyaltyRewardHours loyaltyRewardHours;
    private String mapImageUrl;

    public String getName() {
        return name;
    }

    public ParkingCreateRequestDTO setName(String name) {
        this.name = name;
        return this;
    }

    public String getAddress() {
        return address;
    }

    public ParkingCreateRequestDTO setAddress(String address) {
        this.address = address;
        return this;
    }

    public Integer getSpacesCount() {
        return spacesCount;
    }

    public ParkingCreateRequestDTO setSpacesCount(Integer spacesCount) {
        this.spacesCount = spacesCount;
        return this;
    }

    public BigDecimal getPricePerHourBgn() {
        return pricePerHourBgn;
    }

    public ParkingCreateRequestDTO setPricePerHourBgn(BigDecimal pricePerHourBgn) {
        this.pricePerHourBgn = pricePerHourBgn;
        return this;
    }

    public Boolean getCardPaymentEnabled() {
        return cardPaymentEnabled;
    }

    public ParkingCreateRequestDTO setCardPaymentEnabled(Boolean cardPaymentEnabled) {
        this.cardPaymentEnabled = cardPaymentEnabled;
        return this;
    }

    public Boolean getLoyaltyEnabled() {
        return loyaltyEnabled;
    }

    public ParkingCreateRequestDTO setLoyaltyEnabled(Boolean loyaltyEnabled) {
        this.loyaltyEnabled = loyaltyEnabled;
        return this;
    }

    public Integer getLoyaltyVisitPerPoint() {
        return loyaltyVisitPerPoint;
    }

    public ParkingCreateRequestDTO setLoyaltyVisitPerPoint(Integer loyaltyVisitPerPoint) {
        this.loyaltyVisitPerPoint = loyaltyVisitPerPoint;
        return this;
    }

    public Integer getLoyaltyPointsRequired() {
        return loyaltyPointsRequired;
    }

    public ParkingCreateRequestDTO setLoyaltyPointsRequired(Integer loyaltyPointsRequired) {
        this.loyaltyPointsRequired = loyaltyPointsRequired;
        return this;
    }

    public LoyaltyRewardHours getLoyaltyRewardHours() {
        return loyaltyRewardHours;
    }

    public ParkingCreateRequestDTO setLoyaltyRewardHours(LoyaltyRewardHours loyaltyRewardHours) {
        this.loyaltyRewardHours = loyaltyRewardHours;
        return this;
    }

    public String getMapImageUrl() {
        return mapImageUrl;
    }

    public ParkingCreateRequestDTO setMapImageUrl(String mapImageUrl) {
        this.mapImageUrl = mapImageUrl;
        return this;
    }
}
