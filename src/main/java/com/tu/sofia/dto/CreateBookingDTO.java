package com.tu.sofia.dto;

import java.time.LocalDateTime;

public class CreateBookingDTO {
    private Integer spaceNumber;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    public CreateBookingDTO() {
    }

    public CreateBookingDTO(Integer spaceNumber, LocalDateTime startTime, LocalDateTime endTime) {
        this.spaceNumber = spaceNumber;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Integer getSpaceNumber() {
        return spaceNumber;
    }

    public CreateBookingDTO setSpaceNumber(Integer spaceNumber) {
        this.spaceNumber = spaceNumber;
        return this;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public CreateBookingDTO setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
        return this;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public CreateBookingDTO setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
        return this;
    }
}
