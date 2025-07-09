package com.example.movie_booking.util;

import com.example.movie_booking.model.Booking;
import com.example.movie_booking.model.BookingStatus;
import com.example.movie_booking.repository.IBookingRepository;
import com.example.movie_booking.service.BookingService;
import jakarta.annotation.PostConstruct;
import org.quartz.JobKey;
import org.quartz.SchedulerException;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class BookingStartupChecker {
    @Autowired
    private BookingService bookingService;


    @PostConstruct
    public void checkAndRescheduleBookings() {
        List<Booking> bookings = bookingService.findBookingbyBookingStatusIdNot(    3l);
        BookingStatus seen=bookingService.findByBookingStatusId(3L);
        for (Booking b : bookings) {
            int durationMinutes = Integer.parseInt(b.getShowTime().getMovie().getDurationMovie());
            LocalDateTime endTime = b.getShowTime().getStartTime().plusMinutes(durationMinutes);
            if (endTime.isBefore(LocalDateTime.now())) {

                b.setBookingStatus(seen);
                bookingService.save(b);
            } else {
                try {
                    bookingService.scheduleBookingStatusJob(b.getId(), endTime);
                    System.out.println("BookingID: " + b.getId() + " | EndTime: " + endTime + " | okee");

                } catch (SchedulerException e) {
                    e.printStackTrace();
                }
            }
        }



        System.out.println("✅ Booking check/reschedule hoàn tất sau khi khởi động.");
    }
}
