package com.example.movie_booking.controller.admin;

import com.example.movie_booking.dto.MovieViewCountDTO;
import com.example.movie_booking.dto.booking.BookingCheckoutDto;
import com.example.movie_booking.dto.booking.RevenueStatusDTO;
import com.example.movie_booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("admin/bookings")
public class BookingManagerController {
    @Autowired
    BookingService bookingService;
    @Autowired
    private MessageSource messageSource;
    @GetMapping("/")
    public ResponseEntity<?> getListBookings() {
        try {
            List<BookingCheckoutDto> list = bookingService.getAllBookings();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/seats-weekly")
    public ResponseEntity<?> getSeatsSoldWeekly(Locale locale) {
        try {
            LocalDate today = LocalDate.now();
            List<Map<String, Object>> stats = new ArrayList<>();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");

            for (int i = 6; i >= 0; i--) {
                LocalDate date = today.minusDays(i);
                long seatsSold = bookingService.countSeatsSoldByDate(date);
                Map<String, Object> dayStats = new HashMap<>();
                dayStats.put("date", date.format(formatter));
                dayStats.put("seats", seatsSold);
                stats.add(dayStats);
            }

            return ResponseEntity.ok(Map.of(
                    "message", messageSource.getMessage("booking.stats.success", null, locale),
                    "data", stats
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", messageSource.getMessage("booking.stats.failed", new Object[]{e.getMessage()}, locale)
            ));
        }
    }


    //    Thống kê
    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueStats(
            @RequestParam String type,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        List<RevenueStatusDTO> status = bookingService.getRevenueStatus(type, year, month);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/revenue/total")
    public ResponseEntity<?> getTotalRevenue() {
        Integer totalRevenue = bookingService.getTotalRevenue();
        return ResponseEntity.ok(totalRevenue);
    }

    @GetMapping("/tickets/total")
    public ResponseEntity<?> getTotalTicketsSold() {
        Integer totalTickets = bookingService.getTotalTicketsSold();
        return ResponseEntity.ok(totalTickets);
    }

    @GetMapping("/top5-most-watched-movies")
    public ResponseEntity<List<MovieViewCountDTO>> getTop5MostWatchedMovies() {
        List<MovieViewCountDTO> topMovies = bookingService.getTop5MostMovies();
        return ResponseEntity.ok(topMovies);
    }
}
