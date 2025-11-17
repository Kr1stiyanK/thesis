package com.tu.sofia.controller;

import com.tu.sofia.dto.AdminBookingDTO;
import com.tu.sofia.dto.BookingFetchDTO;
import com.tu.sofia.model.UserEntity;
import com.tu.sofia.service.ParkingBookingService;
import com.tu.sofia.service.ParkingSpaceBookingService;
import com.tu.sofia.service.UserEntityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/admin/parkings")
public class AdminController {

    private final ParkingBookingService bookingService;

    public AdminController(ParkingBookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/{parkingId}/bookings")
    public List<AdminBookingDTO> getAllBookingsForParking(@PathVariable Long parkingId) {
        return bookingService.getAllBookingsForParking(parkingId);
    }

//    private final UserEntityService userEntityService;
//
//    private final ParkingSpaceBookingService bookingService;
//
//
//    public AdminController(UserEntityService userEntityService, ParkingSpaceBookingService bookingService) {
//        this.userEntityService = userEntityService;
//        this.bookingService = bookingService;
//    }
//
//    @GetMapping("/all-profiles")
//    public ResponseEntity<List<UserEntity>> getAllProfiles() {
//        List<UserEntity> users = userEntityService.findAllUsers();
//        return ResponseEntity.ok(users);
//    }
//
//    @GetMapping("/all-bookings")
//    public ResponseEntity<List<AdminBookingDTO>> getAllBookings() {
//        List<AdminBookingDTO> bookings = bookingService.getAllBookings();
//        return ResponseEntity.ok(bookings);
//    }
}
