package com.tu.sofia.controller;

import com.tu.sofia.dto.BookingSlotDTO;
import com.tu.sofia.dto.CreateBookingDTO;
import com.tu.sofia.repositories.UserEntityRepository;
import com.tu.sofia.service.ParkingBookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/parkings/{parkingId}/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class ParkingBookingController {
    private final ParkingBookingService bookingService;
    private final UserEntityRepository userRepository;

    public ParkingBookingController(ParkingBookingService bookingService, UserEntityRepository userRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<BookingSlotDTO> getBookingsForDay(
            @PathVariable Long parkingId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return bookingService.getBookingsForParkingAndDate(parkingId, date);
    }

    @PostMapping
    public BookingSlotDTO createBooking(
            @PathVariable Long parkingId,
            @RequestBody CreateBookingDTO dto) {
        return bookingService.createBooking(parkingId, dto);
    }
}
