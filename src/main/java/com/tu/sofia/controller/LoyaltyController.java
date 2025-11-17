package com.tu.sofia.controller;

import com.tu.sofia.dto.LoyaltySummaryDTO;
import com.tu.sofia.model.UserEntity;
import com.tu.sofia.repositories.ParkingRepository;
import com.tu.sofia.repositories.UserEntityRepository;
import com.tu.sofia.service.LoyaltyService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loyalty")
@CrossOrigin(origins = "http://localhost:4200")
public class LoyaltyController {

    private final LoyaltyService loyaltyService;
    private final UserEntityRepository userRepo;
    private final ParkingRepository parkingRepo;

    public LoyaltyController(LoyaltyService loyaltyService,
                             UserEntityRepository userRepo, ParkingRepository parkingRepo) {
        this.loyaltyService = loyaltyService;
        this.userRepo = userRepo;
        this.parkingRepo = parkingRepo;
    }

    private Long getUserId(UserDetails principal) {
        UserEntity user = userRepo.findByEmail(principal.getUsername())
                .orElseThrow();
        return user.getId();
    }

    @GetMapping("/parking/{parkingId}")
    public LoyaltySummaryDTO getSummaryForParking(
            @AuthenticationPrincipal UserDetails principal,
            @PathVariable Long parkingId) {

        Long userId = getUserId(principal);
        return loyaltyService.getSummaryForParking(userId, parkingId);
    }

    @GetMapping("/my")
    public List<LoyaltySummaryDTO> getMyLoyalty(@AuthenticationPrincipal UserDetails principal) {
        Long userId = getUserId(principal);
        return parkingRepo.findAll().stream()
                .filter(p -> Boolean.TRUE.equals(p.getLoyaltyEnabled()))
                .map(p -> loyaltyService.getSummaryForParking(userId, p.getId()))
                .toList();
    }
}
