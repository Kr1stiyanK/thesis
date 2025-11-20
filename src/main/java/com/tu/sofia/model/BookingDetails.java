package com.tu.sofia.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class BookingDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    @ManyToOne
    @JoinColumn(name = "parking_id", nullable = false)
    private ParkingEntity parking;

    @Column(name = "book_start")
    private LocalDateTime start;

    @Column(name = "book_end")
    private LocalDateTime end;

    @Column(name = "user_id")
    private Long userId;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "bookingDetails", orphanRemoval = true)
    private OrderEntity order;

    public String getText() {
        return text;
    }

    public BookingDetails setText(String text) {
        this.text = text;
        return this;
    }

    public Long getUserId() {
        return userId;
    }

    public BookingDetails setUserId(Long userId) {
        this.userId = userId;
        return this;
    }

    public BookingDetails setId(Long id) {
        this.id = id;
        return this;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public BookingDetails setStart(LocalDateTime start) {
        this.start = start;
        return this;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    public BookingDetails setEnd(LocalDateTime end) {
        this.end = end;
        return this;
    }

    public OrderEntity getOrder() {
        return order;
    }

    public BookingDetails setOrder(OrderEntity order) {
        this.order = order;
        return this;
    }

    public ParkingEntity getParking() {
        return parking;
    }

    public BookingDetails setParking(ParkingEntity parking) {
        this.parking = parking;
        return this;
    }
}
