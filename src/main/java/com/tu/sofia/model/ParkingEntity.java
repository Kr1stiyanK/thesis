package com.tu.sofia.model;

import com.tu.sofia.enums.LoyaltyRewardHours;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
public class ParkingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, length = 1024)
    private String address;

    private Integer spacesCount;

    @Column(precision = 12, scale = 2)
    private BigDecimal pricePerHourBgn;

    private Boolean cardPaymentEnabled = false;

    private Boolean loyaltyEnabled = false;

    private Integer loyaltyVisitPerPoint;

    private Integer loyaltyPointsRequired;

    @Enumerated(EnumType.STRING)
    private LoyaltyRewardHours loyaltyRewardHours;

    private String mapImageUrl;

    private Long ownerId;

    public Long getId() {
        return id;
    }

    public ParkingEntity setId(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public ParkingEntity setName(String name) {
        this.name = name;
        return this;
    }

    public String getAddress() {
        return address;
    }

    public ParkingEntity setAddress(String address) {
        this.address = address;
        return this;
    }

    public Integer getSpacesCount() {
        return spacesCount;
    }

    public ParkingEntity setSpacesCount(Integer spacesCount) {
        this.spacesCount = spacesCount;
        return this;
    }

    public BigDecimal getPricePerHourBgn() {
        return pricePerHourBgn;
    }

    public ParkingEntity setPricePerHourBgn(BigDecimal pricePerHourBgn) {
        this.pricePerHourBgn = pricePerHourBgn;
        return this;
    }

    public Boolean getCardPaymentEnabled() {
        return cardPaymentEnabled;
    }

    public ParkingEntity setCardPaymentEnabled(Boolean cardPaymentEnabled) {
        this.cardPaymentEnabled = cardPaymentEnabled;
        return this;
    }

    public Boolean getLoyaltyEnabled() {
        return loyaltyEnabled;
    }

    public ParkingEntity setLoyaltyEnabled(Boolean loyaltyEnabled) {
        this.loyaltyEnabled = loyaltyEnabled;
        return this;
    }

    public Integer getLoyaltyVisitPerPoint() {
        return loyaltyVisitPerPoint;
    }

    public ParkingEntity setLoyaltyVisitPerPoint(Integer loyaltyVisitPerPoint) {
        this.loyaltyVisitPerPoint = loyaltyVisitPerPoint;
        return this;
    }

    public Integer getLoyaltyPointsRequired() {
        return loyaltyPointsRequired;
    }

    public ParkingEntity setLoyaltyPointsRequired(Integer loyaltyPointsRequired) {
        this.loyaltyPointsRequired = loyaltyPointsRequired;
        return this;
    }

    public LoyaltyRewardHours getLoyaltyRewardHours() {
        return loyaltyRewardHours;
    }

    public ParkingEntity setLoyaltyRewardHours(LoyaltyRewardHours loyaltyRewardHours) {
        this.loyaltyRewardHours = loyaltyRewardHours;
        return this;
    }

    public String getMapImageUrl() {
        return mapImageUrl;
    }

    public ParkingEntity setMapImageUrl(String mapImageUrl) {
        this.mapImageUrl = mapImageUrl;
        return this;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public ParkingEntity setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
        return this;
    }
}
