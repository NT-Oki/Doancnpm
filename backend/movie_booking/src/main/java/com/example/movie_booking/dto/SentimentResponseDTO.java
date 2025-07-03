package com.example.movie_booking.dto;

import lombok.*;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SentimentResponseDTO {
    private String sentiment;
    private double score;
}
