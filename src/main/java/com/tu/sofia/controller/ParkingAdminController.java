package com.tu.sofia.controller;

import com.tu.sofia.dto.ParkingCreateRequestDTO;
import com.tu.sofia.model.ParkingEntity;
import com.tu.sofia.model.UserEntity;
import com.tu.sofia.repositories.UserEntityRepository;
import com.tu.sofia.service.ParkingService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/parkings")
@CrossOrigin(origins = "http://localhost:4200")
public class ParkingAdminController {
    private final ParkingService parkingService;
    private final UserEntityRepository userRepository;

    public ParkingAdminController(ParkingService parkingService,
                                  UserEntityRepository userRepository) {
        this.parkingService = parkingService;
        this.userRepository = userRepository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/my")
    public List<ParkingEntity> getMyParkings(@AuthenticationPrincipal UserDetails principal) {
        UserEntity user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow();
        return parkingService.getParkingsByOwnerId(user.getId());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ParkingEntity createParking(@AuthenticationPrincipal UserDetails principal,
                                       @RequestBody ParkingCreateRequestDTO request) {
        UserEntity user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow();
        return parkingService.createParking(user.getId(), request);
    }
}
