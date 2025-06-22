package org.c07.movie_booking.dto;


import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.c07.movie_booking.model.Room;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatResponse {
    Long id;
    String seatNumber;
    String description;
    Long room_id;
    int price;
}
