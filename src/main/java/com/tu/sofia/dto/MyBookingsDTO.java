package com.tu.sofia.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MyBookingsDTO {

    private Long id;
    private String parkingName;
    private Integer spaceNumber;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal amountBgn;

    public Long getId() {
        return id;
    }

    public MyBookingsDTO setId(Long id) {
        this.id = id;
        return this;
    }

    public String getParkingName() {
        return parkingName;
    }

    public MyBookingsDTO setParkingName(String parkingName) {
        this.parkingName = parkingName;
        return this;
    }

    public Integer getSpaceNumber() {
        return spaceNumber;
    }

    public MyBookingsDTO setSpaceNumber(Integer spaceNumber) {
        this.spaceNumber = spaceNumber;
        return this;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public MyBookingsDTO setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
        return this;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public MyBookingsDTO setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
        return this;
    }

    public BigDecimal getAmountBgn() {
        return amountBgn;
    }

    public MyBookingsDTO setAmountBgn(BigDecimal amountBgn) {
        this.amountBgn = amountBgn;
        return this;
    }
}
