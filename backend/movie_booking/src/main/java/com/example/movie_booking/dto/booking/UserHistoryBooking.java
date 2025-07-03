package com.example.movie_booking.dto.booking;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserHistoryBooking {
    String codeBooking;
    String dateBooking;
    Integer totalAmount;
    String status;
    String movieTitle;
    String startTime;
    List<String> seatNames;
}