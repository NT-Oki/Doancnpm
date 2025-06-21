package org.c07.movie_booking.dto;

import lombok.Data;

@Data
public class BookingRequestDTO {
    private Long seatId;
    private Long showtimeId;
    private Long userId;
}