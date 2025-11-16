package com.tu.sofia.service;

import com.tu.sofia.dto.BookingSlotDTO;
import com.tu.sofia.dto.CreateBookingDTO;
import com.tu.sofia.model.ParkingBookingEntity;
import com.tu.sofia.model.ParkingEntity;
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

    public ParkingBookingService(ParkingBookingRepository bookingRepo, ParkingRepository parkingRepo) {
        this.bookingRepo = bookingRepo;
        this.parkingRepo = parkingRepo;
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

    public BookingSlotDTO createBooking(Long parkingId, CreateBookingDTO dto) {
        ParkingEntity parking = parkingRepo.findById(parkingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking not found"));

        LocalDateTime now = LocalDateTime.now();

        if (dto.getStartTime().isBefore(now) || dto.getEndTime().isBefore(now)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot book in the past");
        }

        LocalDateTime start = dto.getStartTime();
        LocalDateTime end = dto.getEndTime();

        if (!end.isAfter(start)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "End time must be after start time");
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

        ParkingBookingEntity booking = new ParkingBookingEntity()
                .setParking(parking)
                .setSpaceNumber(dto.getSpaceNumber())
                .setStartTime(start)
                .setEndTime(end)
                .setAmountBgn(amount);

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
}
