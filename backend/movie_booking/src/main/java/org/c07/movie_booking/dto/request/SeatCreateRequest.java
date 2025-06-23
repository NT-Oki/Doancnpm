package org.c07.movie_booking.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;


@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatCreateRequest {
    String seatNumber;
    String description;
    Long room_id;
    int price;
}
