package org.c07.movie_booking.service;

import org.c07.movie_booking.dto.admin.MovieDTO;
import org.c07.movie_booking.model.Movie;
import java.util.List;
import java.util.Optional;

public interface IMovieService {
    List<Movie> findAll();

    Optional<Movie> findById(Long id);

    List<Movie> findActiveMovies();

    Movie findByIdAndStatus(Long id, int statusId);

    Movie save(MovieDTO dto);

    void delete(Movie movie);

    Movie convertToEntity(MovieDTO dto);
}
