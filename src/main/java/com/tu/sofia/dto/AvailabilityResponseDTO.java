package com.tu.sofia.dto;

public class AvailabilityResponseDTO {
    private boolean available;

    public AvailabilityResponseDTO() {
    }

    public AvailabilityResponseDTO(boolean available) {
        this.available = available;
    }

    public boolean isAvailable() {
        return available;
    }

    public AvailabilityResponseDTO setAvailable(boolean available) {
        this.available = available;
        return this;
    }
}
