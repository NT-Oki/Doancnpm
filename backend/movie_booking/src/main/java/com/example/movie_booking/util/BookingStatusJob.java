package com.example.movie_booking.util;

import com.example.movie_booking.model.Booking;
import com.example.movie_booking.model.BookingStatus;
import com.example.movie_booking.repository.IBookingRepository;
import com.example.movie_booking.repository.IBookingStatusRepository;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BookingStatusJob implements Job {

    @Autowired
    private IBookingRepository bookingRepository;
    @Autowired
    private IBookingStatusRepository bookingStatusRepository;

    @Override
    public void execute(JobExecutionContext context) {
        Long bookingId = context.getMergedJobDataMap().getLong("bookingId");
        System.out.println(bookingId+"dâyyyyyyyyyyyyyy");
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        BookingStatus seen=bookingStatusRepository.findById(3l).orElse(null);
        if (booking != null && !booking.getBookingStatus().equals(seen)) {
            booking.setBookingStatus(seen);
            bookingRepository.save(booking);
            System.out.println(" Booking " + bookingId + " đã chuyển status = 3(đã xem)");
        }
    }
}

