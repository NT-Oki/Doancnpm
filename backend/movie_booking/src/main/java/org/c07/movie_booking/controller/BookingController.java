package org.c07.movie_booking.controller;

import org.c07.movie_booking.dto.request.BookingRequestDTO;
import org.c07.movie_booking.model.*;
import org.c07.movie_booking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/booking")
public class BookingController {
    @Autowired
    private IBookingRepository bookingRepository;
    @Autowired
    private ISeatRepository seatRepository;
    @Autowired
    private IShowTimeRepository showtimeRepository;
    @Autowired
    private IUserRepository userRepository;

    @PostMapping("/reserve")
    public ResponseEntity<?> bookSeat(@RequestBody BookingRequestDTO dto) {
        Seat seat = seatRepository.findById(dto.getSeatId()).orElseThrow();
        Showtime showtime = showtimeRepository.findById(dto.getShowtimeId()).orElseThrow();
        User user = userRepository.findById(dto.getUserId()).orElseThrow();

        boolean alreadyBooked = bookingRepository.findAll()
            .stream()
            .anyMatch(b -> b.getShowTime().getId() == showtime.getId() && b.getSeat().getId().equals(seat.getId()));
        if (alreadyBooked) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Seat already booked");
        }

        Booking booking = Booking.builder()
            .seat(seat)
            .showTime(showtime)
            .user(user)
            .dateBooking(LocalDate.now())
            .totalAmount(seat.getPrice())
            .build();
        bookingRepository.save(booking);
        return ResponseEntity.ok("Booking successful");
    }
}
