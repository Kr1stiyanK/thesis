package com.tu.sofia.dto;

import java.time.LocalDateTime;

public class QuickBookingDTO {

    private Long parkingId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;


    public LocalDateTime getStartTime() {
        return startTime;
    }

    public QuickBookingDTO setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
        return this;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public QuickBookingDTO setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
        return this;
    }

    public Long getParkingId() {
        return parkingId;
    }

    public QuickBookingDTO setParkingId(Long parkingId) {
        this.parkingId = parkingId;
        return this;
    }
}
