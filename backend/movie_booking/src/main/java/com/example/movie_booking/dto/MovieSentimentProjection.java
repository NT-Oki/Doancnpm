package com.example.movie_booking.dto;

public interface MovieSentimentProjection {
    Long getMovieId();
    String getMovieName();
    String getAvatar();
    double getAverageSentimentScore();
}
