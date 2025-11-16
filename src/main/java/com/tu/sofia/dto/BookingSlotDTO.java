package com.tu.sofia.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingSlotDTO {
    private Long id;
    private Integer spaceNumber;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal amountBgn;

    public BookingSlotDTO() {
    }

    public BookingSlotDTO(Long id, Integer spaceNumber, LocalDateTime startTime, LocalDateTime endTime, BigDecimal amountBgn) {
        this.id = id;
        this.spaceNumber = spaceNumber;
        this.startTime = startTime;
        this.endTime = endTime;
        this.amountBgn = amountBgn;
    }

    public Long getId() {
        return id;
    }

    public BookingSlotDTO setId(Long id) {
        this.id = id;
        return this;
    }

    public Integer getSpaceNumber() {
        return spaceNumber;
    }

    public BookingSlotDTO setSpaceNumber(Integer spaceNumber) {
        this.spaceNumber = spaceNumber;
        return this;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public BookingSlotDTO setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
        return this;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public BookingSlotDTO setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
        return this;
    }

    public BigDecimal getAmountBgn() {
        return amountBgn;
    }

    public BookingSlotDTO setAmountBgn(BigDecimal amountBgn) {
        this.amountBgn = amountBgn;
        return this;
    }
}
