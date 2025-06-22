package org.c07.movie_booking.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovieDTO {
    private Long id;
    private String nameMovie;
    private String releaseDate;
    private String durationMovie;
    private String actor;
    private String director;
    private String studio;
    private String content;
    private String trailer;
    private String avatar;
}
