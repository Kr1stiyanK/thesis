package com.tu.sofia.controller;

import com.tu.sofia.dto.AvailabilityResponseDTO;
import com.tu.sofia.dto.BookingSlotDTO;
import com.tu.sofia.dto.CreateBookingDTO;
import com.tu.sofia.dto.QuickBookingDTO;
import com.tu.sofia.repositories.UserEntityRepository;
import com.tu.sofia.service.ParkingBookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long parkingId,
            @RequestBody CreateBookingDTO dto) {
        if (principal == null) {
            dto.setUseBonus(false);
            return bookingService.createBooking(parkingId, dto, null);
        }

        Long userId = userRepository.findByEmail(principal.getUsername())
                .orElseThrow()
                .getId();

        return bookingService.createBooking(parkingId, dto, userId);
    }

    @PostMapping("/quick-availability")
    public AvailabilityResponseDTO checkQuickAvailability(@PathVariable Long parkingId, @RequestBody QuickBookingDTO request) {
        return new AvailabilityResponseDTO(bookingService.hasFreeSpace(parkingId, request.getStartTime(), request.getEndTime()));
    }
}
