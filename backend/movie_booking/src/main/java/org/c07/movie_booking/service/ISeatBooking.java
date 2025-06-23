package org.c07.movie_booking.service;

import org.c07.movie_booking.dto.request.SeatBookingRequest;
import org.c07.movie_booking.dto.response.SeatBookingResponse;

public interface ISeatBooking {
    SeatBookingResponse bookSeat(SeatBookingRequest request);
}