package com.example.movie_booking.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieSentimentDTO {
    private Long movieId;
    private String movieName;
    private String avatar;
    private double averageSentimentScore;
}
