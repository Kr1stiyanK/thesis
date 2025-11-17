package com.tu.sofia.service;

import com.tu.sofia.dto.*;
import com.tu.sofia.model.ParkingBookingEntity;
import com.tu.sofia.model.ParkingEntity;
import com.tu.sofia.model.UserEntity;
import com.tu.sofia.repositories.ParkingBookingRepository;
import com.tu.sofia.repositories.ParkingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ParkingBookingService {
    private final ParkingBookingRepository bookingRepo;
    private final ParkingRepository parkingRepo;
    private final LoyaltyService loyaltyService;
    private final UserEntityService userEntityService;

    public ParkingBookingService(ParkingBookingRepository bookingRepo, ParkingRepository parkingRepo, LoyaltyService loyaltyService, UserEntityService userEntityService) {
        this.bookingRepo = bookingRepo;
        this.parkingRepo = parkingRepo;
        this.loyaltyService = loyaltyService;
        this.userEntityService = userEntityService;
    }

    public List<AdminBookingDTO> getAllBookingsForParking(Long parkingId) {
        return bookingRepo.findByParkingIdOrderByStartTimeDesc(parkingId)
                .stream()
                .map(this::toAdminDto)
                .toList();
    }

    public List<BookingSlotDTO> getBookingsForParkingAndDate(Long parkingId, LocalDate date) {
        LocalDateTime from = date.atStartOfDay();
        LocalDateTime to = date.plusDays(1).atStartOfDay();

        return bookingRepo
                .findByParkingIdAndStartTimeBetween(parkingId, from, to)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<MyBookingsDTO> getBookingsByEmail(String email) {
        List<ParkingBookingEntity> bookings = bookingRepo.findByUser_EmailOrderByStartTimeDesc(email);

        return bookings.stream()
                .map(this::toMyBookingDto)
                .toList();
    }

    public BookingSlotDTO createBooking(Long parkingId, CreateBookingDTO dto, Long userId) {
        ParkingEntity parking = parkingRepo.findById(parkingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking not found"));

        LocalDateTime now = LocalDateTime.now();

        if (dto.getStartTime().isBefore(now) || dto.getEndTime().isBefore(now)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot book in the past");
        }

        LocalDateTime start = dto.getStartTime();
        LocalDateTime end = dto.getEndTime();

        if (!end.isAfter(start)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time");
        }

        if (!Boolean.TRUE.equals(parking.getOpen24Hours())) {
            LocalTime opening = parking.getOpeningTime();
            LocalTime closing = parking.getClosingTime();

            LocalTime startT = dto.getStartTime().toLocalTime();
            LocalTime endT = dto.getEndTime().toLocalTime();

            if (startT.isBefore(opening) || endT.isAfter(closing)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Outside working hours");
            }
        }

        // Проверка за конфликт
        List<ParkingBookingEntity> conflicts =
                bookingRepo.findByParkingIdAndSpaceNumberAndStartTimeLessThanAndEndTimeGreaterThan(
                        parkingId,
                        dto.getSpaceNumber(),
                        dto.getEndTime(),
                        dto.getStartTime()
                );

        if (!conflicts.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slot already booked");
        }

        long minutes = Duration.between(start, end).toMinutes();
        BigDecimal hours = BigDecimal.valueOf(minutes)
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);

        BigDecimal pricePerHour = parking.getPricePerHourBgn() != null
                ? parking.getPricePerHourBgn()
                : BigDecimal.ZERO;

        BigDecimal amount = pricePerHour.multiply(hours);

        if (userId != null && dto.getUseBonus()) {
            LoyaltySummaryDTO summary = loyaltyService.getSummaryForParking(userId, parkingId);

            if (!summary.isLoyaltyEnabled() || !summary.isCanUseBonus()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough loyalty points");
            }

            BigDecimal freeHours = BigDecimal.valueOf(summary.getRewardHours() != null ? summary.getRewardHours() : 0);
            BigDecimal billableHours = hours.subtract(freeHours);
            if (billableHours.compareTo(BigDecimal.ZERO) < 0) {
                billableHours = BigDecimal.ZERO;
            }

            amount = billableHours.multiply(pricePerHour);

            // Записваме, че потребителят е използвал бонус
            loyaltyService.consumeReward(userId, parkingId);
        }

        UserEntity customer = userEntityService.getUserById(userId);

        ParkingBookingEntity booking = new ParkingBookingEntity()
                .setParking(parking)
                .setSpaceNumber(dto.getSpaceNumber())
                .setStartTime(start)
                .setEndTime(end)
                .setAmountBgn(amount)
                .setUser(customer);

        booking = bookingRepo.save(booking);

        return toDto(booking);
    }

    private BookingSlotDTO toDto(ParkingBookingEntity e) {
        return new BookingSlotDTO()
                .setId(e.getId())
                .setSpaceNumber(e.getSpaceNumber())
                .setStartTime(e.getStartTime())
                .setEndTime(e.getEndTime())
                .setAmountBgn(e.getAmountBgn());
    }

    private MyBookingsDTO toMyBookingDto(ParkingBookingEntity e) {
        return new MyBookingsDTO()
                .setId(e.getId())
                .setParkingName(e.getParking() != null ? e.getParking().getName() : null)
                .setSpaceNumber(e.getSpaceNumber())
                .setStartTime(e.getStartTime())
                .setEndTime(e.getEndTime())
                .setAmountBgn(e.getAmountBgn());
    }

    private AdminBookingDTO toAdminDto(ParkingBookingEntity e) {
        return new AdminBookingDTO()
                .setId(e.getId())
                .setParkingName(e.getParking().getName())
                .setSpaceNumber(e.getSpaceNumber())
                .setStartTime(e.getStartTime())
                .setEndTime(e.getEndTime())
                .setAmountBgn(e.getAmountBgn())
                .setUserEmail(e.getUser() != null ? e.getUser().getEmail() : null);
    }
}
