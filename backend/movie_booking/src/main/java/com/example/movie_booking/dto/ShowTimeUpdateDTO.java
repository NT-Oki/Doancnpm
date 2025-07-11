package com.example.movie_booking.dto;

import lombok.Data;

@Data
public class ShowTimeUpdateDTO {
    private Long movieId;
    private Long roomId;
    private String showDate;   // dạng "dd/MM/yyyy"
    private String startTime;  // dạng "yyyy-MM-dd'T'HH:mm"

}
