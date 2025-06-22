package org.c07.movie_booking.service;

import org.c07.movie_booking.dto.MovieDTO;
import org.c07.movie_booking.dto.request.MovieCreateRequest;
import org.c07.movie_booking.model.Movie;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public interface IMovieService {
    List<MovieDTO> getFindAll();
    List<Movie> getSearchField(Map<String, Objects> params);
    void deleteById(Long id);
    MovieDTO crateMovie(MovieCreateRequest request);
    List<MovieDTO> getAllMovies();
}
