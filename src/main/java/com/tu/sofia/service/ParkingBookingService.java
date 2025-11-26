package com.tu.sofia.service;

import com.tu.sofia.dto.*;
import com.tu.sofia.model.ParkingBookingEntity;
import com.tu.sofia.model.ParkingEntity;
import com.tu.sofia.model.UserEntity;
import com.tu.sofia.repositories.ParkingBookingRepository;
import com.tu.sofia.repositories.ParkingRepository;
import org.springframework.beans.factory.annotation.Value;
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
                .findByParkingIdAndEndTimeAfterAndStartTimeBefore(parkingId, from, to)
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Паркингът не е намерен"));

        LocalDateTime now = LocalDateTime.now().minusMinutes(3);

        if (dto.getStartTime().isBefore(now) || dto.getEndTime().isBefore(now)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Не може да се резервира в миналото");
        }

        LocalDateTime start = dto.getStartTime();
        LocalDateTime end = dto.getEndTime();

        if (!end.isAfter(start)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Крайният час/дата трябва да е след началния.");
        }

        if (!Boolean.TRUE.equals(parking.getOpen24Hours())) {
            LocalTime opening = parking.getOpeningTime();
            LocalTime closing = parking.getClosingTime();

            LocalTime startT = dto.getStartTime().toLocalTime();
            LocalTime endT = dto.getEndTime().toLocalTime();

            if (startT.isBefore(opening) || endT.isAfter(closing)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Извън работните часове");
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
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Паркомястото вече е заето");
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

    public BookingSlotDTO createQuickBooking(QuickBookingDTO request) {

        ParkingEntity parking = parkingRepo.findById(request.getParkingId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Паркингът не е намерен."));

        LocalDateTime now = LocalDateTime.now().minusMinutes(3);
        LocalDateTime start = request.getStartTime();
        LocalDateTime end = request.getEndTime();

        if (start == null || end == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Липсва начален или краен час.");
        }

        if (start.isBefore(now) || end.isBefore(now)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Не може да се резервира в миналото.");
        }

        if (!end.isAfter(start)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Крайният час/дата трябва да е след началния.");
        }

        // Работно време
        if (!Boolean.TRUE.equals(parking.getOpen24Hours())) {
            LocalTime opening = parking.getOpeningTime();
            LocalTime closing = parking.getClosingTime();

            if (opening == null || closing == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Работното време на паркинга не е конфигурирано.");
            }

            LocalTime startT = start.toLocalTime();
            LocalTime endT = end.toLocalTime();

            if (startT.isBefore(opening) || endT.isAfter(closing)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        String.format("Паркингът работи между %s и %s.",
                                opening, closing)
                );
            }
        }

        // Намираме първо свободно място
        Integer freeSpace = findFirstFreeSpace(parking, start, end);
        if (freeSpace == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Няма свободни места за избрания интервал.");
        }

        CreateBookingDTO dto = new CreateBookingDTO()
                .setSpaceNumber(freeSpace)
                .setStartTime(start)
                .setEndTime(end);

        Long guestUserId = 2L;

        return createBooking(parking.getId(), dto, guestUserId);
    }

    public boolean hasFreeSpace(Long parkingId, LocalDateTime startTime, LocalDateTime endTime) {
        ParkingEntity parking = parkingRepo.findById(parkingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Паркингът не е намерен"));

        long totalSpaces = parking.getSpacesCount();

        long taken = bookingRepo.countOverlappingBookings(parkingId, startTime, endTime);

        return taken < totalSpaces;
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

    private Integer findFirstFreeSpace(ParkingEntity parking, LocalDateTime start, LocalDateTime end) {
        int spaces = parking.getSpacesCount();
        for (int space = 1; space <= spaces; space++) {

            boolean hasConflict = bookingRepo.existsByParkingIdAndSpaceNumberAndStartTimeLessThanAndEndTimeGreaterThan(parking.getId(), space, end, start);

            if (!hasConflict) {
                return space;
            }
        }
        return null;
    }

}
