package com.example.movie_booking.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Builder
@Setter
@Getter
public class ReviewResponse {

    private long id;

    private long movieId;

    private long userId;

    private String email;

    private String avatar;

    private int rating;

    private String sentiment;

    private double sentimentScore;

    private String comment;

    private LocalDateTime updatedAt;

}
