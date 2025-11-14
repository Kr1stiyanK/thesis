package com.tu.sofia.controller;

import com.tu.sofia.dto.ParkingRequestDTO;
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
@PreAuthorize("hasAuthority('ADMIN')")
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

    @GetMapping("/my")
    public List<ParkingEntity> getMyParkings(@AuthenticationPrincipal UserDetails principal) {
        Long ownerId = getUserId(principal);
        return parkingService.getParkingsByOwnerId(ownerId);
    }


    @PostMapping
    public ParkingEntity createParking(@AuthenticationPrincipal UserDetails principal,
                                       @RequestBody ParkingRequestDTO requestDTO) {
        Long ownerId = getUserId(principal);
        return parkingService.createParking(ownerId, requestDTO);
    }

    @PutMapping("/{id}")
    public ParkingEntity updateParking(@AuthenticationPrincipal UserDetails principal,
                                       @PathVariable("id") Long parkingId,
                                       @RequestBody ParkingRequestDTO requestDTO) {
        Long ownerId = getUserId(principal);

        return parkingService.updateParking(ownerId, parkingId, requestDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteParking(@AuthenticationPrincipal UserDetails principal,
                              @PathVariable("id") Long parkingId) {

        Long ownerId = getUserId(principal);

        parkingService.deleteParking(ownerId, parkingId);
    }


    private Long getUserId(@AuthenticationPrincipal UserDetails principal) {
        return userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

}
