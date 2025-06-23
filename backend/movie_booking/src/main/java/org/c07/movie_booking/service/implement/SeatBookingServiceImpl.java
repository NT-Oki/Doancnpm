package org.c07.movie_booking.service.implement;

import org.c07.movie_booking.dto.request.SeatBookingRequest;
import org.c07.movie_booking.dto.response.SeatBookingResponse;
import org.c07.movie_booking.model.Booking;
import org.c07.movie_booking.model.Seat;
import org.c07.movie_booking.model.Showtime;
import org.c07.movie_booking.repository.IBookingRepository;
import org.c07.movie_booking.repository.ISeatRepository;
import org.c07.movie_booking.repository.IShowtimeRepository;
import org.c07.movie_booking.service.ISeatBooking;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatBookingServiceImpl implements ISeatBooking {

    ISeatRepository seatRepository;
    IShowtimeRepository showtimeRepository;
    IBookingRepository bookingRepository;

    @Override
    public SeatBookingResponse bookSeat(SeatBookingRequest request) {
//        Kiểm tra thời gian chiếu
        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());

        for (Seat seat : seats) {
            if (seat.isAvailable()) {
                return new SeatBookingResponse(false, "Seat");
            }
        }

        for (Seat seat : seats) {
            seat.setAvailable(true);
            seatRepository.save(seat);
            bookingRepository.save(new Booking(seat, showtime));
        }

        return new SeatBookingResponse(true, "Successful");
    }
}
