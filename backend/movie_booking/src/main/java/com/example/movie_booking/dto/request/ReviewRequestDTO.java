package com.example.movie_booking.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequestDTO implements Serializable {
    private long movieId;
    private long userId;
    private int rating;
    private String comment;
}
