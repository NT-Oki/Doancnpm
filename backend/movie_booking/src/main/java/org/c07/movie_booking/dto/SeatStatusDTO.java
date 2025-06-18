package org.c07.movie_booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SeatStatusDTO {
    private Long seatId;
    private String seatNumber;
    private boolean booked;
}