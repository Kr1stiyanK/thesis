package com.tu.sofia.dto;

import java.math.BigDecimal;
import java.time.LocalTime;

public class ParkingScheduleMetaDTO {
    private Long id;
    private String name;
    private Integer spacesCount;
    private Boolean open24Hours;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private BigDecimal pricePerHourBgn;
    private Boolean cardPaymentEnabled;

    public Long getId() {
        return id;
    }

    public ParkingScheduleMetaDTO setId(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public ParkingScheduleMetaDTO setName(String name) {
        this.name = name;
        return this;
    }

    public Integer getSpacesCount() {
        return spacesCount;
    }

    public ParkingScheduleMetaDTO setSpacesCount(Integer spacesCount) {
        this.spacesCount = spacesCount;
        return this;
    }

    public Boolean getOpen24Hours() {
        return open24Hours;
    }

    public ParkingScheduleMetaDTO setOpen24Hours(Boolean open24Hours) {
        this.open24Hours = open24Hours;
        return this;
    }

    public LocalTime getOpeningTime() {
        return openingTime;
    }

    public ParkingScheduleMetaDTO setOpeningTime(LocalTime openingTime) {
        this.openingTime = openingTime;
        return this;
    }

    public LocalTime getClosingTime() {
        return closingTime;
    }

    public ParkingScheduleMetaDTO setClosingTime(LocalTime closingTime) {
        this.closingTime = closingTime;
        return this;
    }

    public BigDecimal getPricePerHourBgn() {
        return pricePerHourBgn;
    }

    public ParkingScheduleMetaDTO setPricePerHourBgn(BigDecimal pricePerHourBgn) {
        this.pricePerHourBgn = pricePerHourBgn;
        return this;
    }

    public Boolean getCardPaymentEnabled() {
        return cardPaymentEnabled;
    }

    public ParkingScheduleMetaDTO setCardPaymentEnabled(Boolean cardPaymentEnabled) {
        this.cardPaymentEnabled = cardPaymentEnabled;
        return this;
    }
}
