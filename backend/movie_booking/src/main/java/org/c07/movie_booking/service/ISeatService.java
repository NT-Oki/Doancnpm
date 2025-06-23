package org.c07.movie_booking.service;

import org.c07.movie_booking.dto.SeatResponse;
import org.c07.movie_booking.dto.request.SeatCreateRequest;


import java.util.List;

public interface ISeatService {
    SeatResponse createSeat(SeatCreateRequest request);
    List<SeatResponse> getAllSeats();
}
