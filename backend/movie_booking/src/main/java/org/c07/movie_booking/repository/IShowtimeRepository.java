package org.c07.movie_booking.repository;

import org.c07.movie_booking.model.Movie;
import org.c07.movie_booking.model.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IShowtimeRepository extends JpaRepository<Showtime, Long> {
    List<Showtime> findByMovie(Movie movie);
}