package org.c07.movie_booking.repository;

import org.c07.movie_booking.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IMovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByStatusFilmId_Id(int statusId);
    Movie findByIdAndStatusFilmId_Id(Long id, int statusId);
}
