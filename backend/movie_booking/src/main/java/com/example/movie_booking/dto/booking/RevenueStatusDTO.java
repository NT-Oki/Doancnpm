package com.example.movie_booking.dto.booking;


import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RevenueStatusDTO {
    String date;
     Integer revenue;
}
