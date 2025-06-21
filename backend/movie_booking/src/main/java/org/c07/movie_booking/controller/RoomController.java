package org.c07.movie_booking.controller;

import org.c07.movie_booking.dto.SeatStatusDTO;
import org.c07.movie_booking.model.*;
import org.c07.movie_booking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class RoomController {
    @Autowired
    private IShowtimeRepository showtimeRepository;
    @Autowired
    private ISeatRepository seatRepository;
    @Autowired
    private IBookingRepository bookingRepository;

    @GetMapping("/showtime/{showtimeId}/seats")
    public List<SeatStatusDTO> getSeatsByShowtime(@PathVariable Long showtimeId) {
        Showtime showtime = showtimeRepository.findById(showtimeId).orElseThrow();
        Room room = showtime.getRoom();
        List<Seat> seats = seatRepository.findByRoom(room);
        List<Booking> bookings = bookingRepository.findAll()
            .stream()
            .filter(b -> b.getShowTime().getId() == showtimeId)
            .collect(Collectors.toList());

        Set<Long> bookedSeatIds = bookings.stream().map(b -> b.getSeat().getId()).collect(Collectors.toSet());

        List<SeatStatusDTO> result = new ArrayList<>();
        for (Seat seat : seats) {
            result.add(new SeatStatusDTO(seat.getId(), seat.getSeatNumber(), bookedSeatIds.contains(seat.getId())));
        }
        return result;
    }
}