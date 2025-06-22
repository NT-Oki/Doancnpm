package org.c07.movie_booking.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieCreateRequest {
    String nameMovie;
    String releaseDate;
    String durationMovie;
    String actor;
    String director;
    String studio;
    String content;
    String trailer;
    String avatar;
}
