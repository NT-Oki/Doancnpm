package org.c07.movie_booking.mapper;

import org.c07.movie_booking.dto.MovieDTO;
import org.c07.movie_booking.dto.request.MovieCreateRequest;
import org.c07.movie_booking.model.Movie;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    Movie toMovie(MovieCreateRequest request);
    MovieDTO toMovieDTO(Movie movie);
}
