package org.c07.movie_booking.mapper;

import org.c07.movie_booking.dto.SeatResponse;
import org.c07.movie_booking.dto.request.SeatCreateRequest;
import org.c07.movie_booking.model.Seat;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SeatMapper {
    Seat toSeat(SeatCreateRequest request);
    SeatResponse toSeatResponse(Seat seat);
}