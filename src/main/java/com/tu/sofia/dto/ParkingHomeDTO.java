package com.tu.sofia.dto;

import com.tu.sofia.enums.LoyaltyRewardHours;

import java.math.BigDecimal;
import java.time.LocalTime;

public class ParkingHomeDTO {
    private Long id;
    private String name;

    private String city;
    private String address;

    private Integer spacesCount;
    private Integer freeSpaces;

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

    public ParkingHomeDTO() {
    }

    public ParkingHomeDTO(Long id, String name, String city, String address, Integer spacesCount, Integer freeSpaces, BigDecimal pricePerHourBgn, Boolean cardPaymentEnabled, Boolean loyaltyEnabled, Integer loyaltyVisitPerPoint, Integer loyaltyPointsRequired, LoyaltyRewardHours loyaltyRewardHours, String mapImageUrl, Boolean open24Hours, LocalTime openingTime, LocalTime closingTime, String contactPhone) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.address = address;
        this.spacesCount = spacesCount;
        this.freeSpaces = freeSpaces;
        this.pricePerHourBgn = pricePerHourBgn;
        this.cardPaymentEnabled = cardPaymentEnabled;
        this.loyaltyEnabled = loyaltyEnabled;
        this.loyaltyVisitPerPoint = loyaltyVisitPerPoint;
        this.loyaltyPointsRequired = loyaltyPointsRequired;
        this.loyaltyRewardHours = loyaltyRewardHours;
        this.mapImageUrl = mapImageUrl;
        this.open24Hours = open24Hours;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.contactPhone = contactPhone;
    }

    public Long getId() {
        return id;
    }

    public ParkingHomeDTO setId(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public ParkingHomeDTO setName(String name) {
        this.name = name;
        return this;
    }

    public String getCity() {
        return city;
    }

    public ParkingHomeDTO setCity(String city) {
        this.city = city;
        return this;
    }

    public String getAddress() {
        return address;
    }

    public ParkingHomeDTO setAddress(String address) {
        this.address = address;
        return this;
    }

    public Integer getSpacesCount() {
        return spacesCount;
    }

    public ParkingHomeDTO setSpacesCount(Integer spacesCount) {
        this.spacesCount = spacesCount;
        return this;
    }

    public Integer getFreeSpaces() {
        return freeSpaces;
    }

    public ParkingHomeDTO setFreeSpaces(Integer freeSpaces) {
        this.freeSpaces = freeSpaces;
        return this;
    }

    public BigDecimal getPricePerHourBgn() {
        return pricePerHourBgn;
    }

    public ParkingHomeDTO setPricePerHourBgn(BigDecimal pricePerHourBgn) {
        this.pricePerHourBgn = pricePerHourBgn;
        return this;
    }

    public Boolean getCardPaymentEnabled() {
        return cardPaymentEnabled;
    }

    public ParkingHomeDTO setCardPaymentEnabled(Boolean cardPaymentEnabled) {
        this.cardPaymentEnabled = cardPaymentEnabled;
        return this;
    }

    public Boolean getLoyaltyEnabled() {
        return loyaltyEnabled;
    }

    public ParkingHomeDTO setLoyaltyEnabled(Boolean loyaltyEnabled) {
        this.loyaltyEnabled = loyaltyEnabled;
        return this;
    }

    public Integer getLoyaltyVisitPerPoint() {
        return loyaltyVisitPerPoint;
    }

    public ParkingHomeDTO setLoyaltyVisitPerPoint(Integer loyaltyVisitPerPoint) {
        this.loyaltyVisitPerPoint = loyaltyVisitPerPoint;
        return this;
    }

    public Integer getLoyaltyPointsRequired() {
        return loyaltyPointsRequired;
    }

    public ParkingHomeDTO setLoyaltyPointsRequired(Integer loyaltyPointsRequired) {
        this.loyaltyPointsRequired = loyaltyPointsRequired;
        return this;
    }

    public LoyaltyRewardHours getLoyaltyRewardHours() {
        return loyaltyRewardHours;
    }

    public ParkingHomeDTO setLoyaltyRewardHours(LoyaltyRewardHours loyaltyRewardHours) {
        this.loyaltyRewardHours = loyaltyRewardHours;
        return this;
    }

    public String getMapImageUrl() {
        return mapImageUrl;
    }

    public ParkingHomeDTO setMapImageUrl(String mapImageUrl) {
        this.mapImageUrl = mapImageUrl;
        return this;
    }

    public Boolean getOpen24Hours() {
        return open24Hours;
    }

    public ParkingHomeDTO setOpen24Hours(Boolean open24Hours) {
        this.open24Hours = open24Hours;
        return this;
    }

    public LocalTime getOpeningTime() {
        return openingTime;
    }

    public ParkingHomeDTO setOpeningTime(LocalTime openingTime) {
        this.openingTime = openingTime;
        return this;
    }

    public LocalTime getClosingTime() {
        return closingTime;
    }

    public ParkingHomeDTO setClosingTime(LocalTime closingTime) {
        this.closingTime = closingTime;
        return this;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public ParkingHomeDTO setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
        return this;
    }
}
