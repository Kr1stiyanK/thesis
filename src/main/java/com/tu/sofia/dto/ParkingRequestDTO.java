package com.tu.sofia.dto;

import com.tu.sofia.enums.LoyaltyRewardHours;

import java.math.BigDecimal;
import java.time.LocalTime;

public class ParkingRequestDTO {
    private String name;
    private String address;
    private String city;
    private Integer spacesCount;
    private BigDecimal pricePerHourBgn;
    private Boolean cardPaymentEnabled;
    private Boolean loyaltyEnabled;
    private Integer loyaltyVisitPerPoint;
    private Integer loyaltyPointsRequired;
    private LoyaltyRewardHours loyaltyRewardHours;
    private String mapImageUrl;
    private Boolean open24Hours;
    private LocalTime openingTime;
    private LocalTime closingTime;

    private String contactPhone;

    public String getName() {
        return name;
    }

    public ParkingRequestDTO setName(String name) {
        this.name = name;
        return this;
    }

    public String getAddress() {
        return address;
    }

    public ParkingRequestDTO setAddress(String address) {
        this.address = address;
        return this;
    }

    public Integer getSpacesCount() {
        return spacesCount;
    }

    public ParkingRequestDTO setSpacesCount(Integer spacesCount) {
        this.spacesCount = spacesCount;
        return this;
    }

    public BigDecimal getPricePerHourBgn() {
        return pricePerHourBgn;
    }

    public ParkingRequestDTO setPricePerHourBgn(BigDecimal pricePerHourBgn) {
        this.pricePerHourBgn = pricePerHourBgn;
        return this;
    }

    public Boolean getCardPaymentEnabled() {
        return cardPaymentEnabled;
    }

    public ParkingRequestDTO setCardPaymentEnabled(Boolean cardPaymentEnabled) {
        this.cardPaymentEnabled = cardPaymentEnabled;
        return this;
    }

    public Boolean getLoyaltyEnabled() {
        return loyaltyEnabled;
    }

    public ParkingRequestDTO setLoyaltyEnabled(Boolean loyaltyEnabled) {
        this.loyaltyEnabled = loyaltyEnabled;
        return this;
    }

    public Integer getLoyaltyVisitPerPoint() {
        return loyaltyVisitPerPoint;
    }

    public ParkingRequestDTO setLoyaltyVisitPerPoint(Integer loyaltyVisitPerPoint) {
        this.loyaltyVisitPerPoint = loyaltyVisitPerPoint;
        return this;
    }

    public Integer getLoyaltyPointsRequired() {
        return loyaltyPointsRequired;
    }

    public ParkingRequestDTO setLoyaltyPointsRequired(Integer loyaltyPointsRequired) {
        this.loyaltyPointsRequired = loyaltyPointsRequired;
        return this;
    }

    public LoyaltyRewardHours getLoyaltyRewardHours() {
        return loyaltyRewardHours;
    }

    public ParkingRequestDTO setLoyaltyRewardHours(LoyaltyRewardHours loyaltyRewardHours) {
        this.loyaltyRewardHours = loyaltyRewardHours;
        return this;
    }

    public String getMapImageUrl() {
        return mapImageUrl;
    }

    public ParkingRequestDTO setMapImageUrl(String mapImageUrl) {
        this.mapImageUrl = mapImageUrl;
        return this;
    }

    public LocalTime getClosingTime() {
        return closingTime;
    }

    public ParkingRequestDTO setClosingTime(LocalTime closingTime) {
        this.closingTime = closingTime;
        return this;
    }

    public LocalTime getOpeningTime() {
        return openingTime;
    }

    public ParkingRequestDTO setOpeningTime(LocalTime openingTime) {
        this.openingTime = openingTime;
        return this;
    }

    public Boolean getOpen24Hours() {
        return open24Hours;
    }

    public ParkingRequestDTO setOpen24Hours(Boolean open24Hours) {
        this.open24Hours = open24Hours;
        return this;
    }

    public String getCity() {
        return city;
    }

    public ParkingRequestDTO setCity(String city) {
        this.city = city;
        return this;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public ParkingRequestDTO setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
        return this;
    }
}
