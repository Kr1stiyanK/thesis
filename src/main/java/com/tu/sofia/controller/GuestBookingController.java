package com.tu.sofia.controller;

import com.tu.sofia.dto.BookingSlotDTO;
import com.tu.sofia.dto.QuickBookingDTO;
import com.tu.sofia.service.ParkingBookingService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/guest/quick-booking")
public class GuestBookingController {

    private final ParkingBookingService parkingSpaceBookingService;

    public GuestBookingController(ParkingBookingService parkingSpaceBookingService) {
        this.parkingSpaceBookingService = parkingSpaceBookingService;
    }


    @PostMapping
    public BookingSlotDTO quickBooking(@RequestBody QuickBookingDTO request) {
        return parkingSpaceBookingService.createQuickBooking(request);
    }
}
