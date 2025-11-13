package com.tu.sofia.dto;

import java.math.BigDecimal;

public class ParkingHomeDTO {
    private Long id;
    private String name;
    private String address;
    private Integer freeSpaces;
    private BigDecimal pricePerHourBgn;

    public ParkingHomeDTO() {
    }

    public ParkingHomeDTO(Long id, String name, String address, Integer freeSpaces, BigDecimal pricePerHourBgn) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.freeSpaces = freeSpaces;
        this.pricePerHourBgn = pricePerHourBgn;
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

    public String getAddress() {
        return address;
    }

    public ParkingHomeDTO setAddress(String address) {
        this.address = address;
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
}
