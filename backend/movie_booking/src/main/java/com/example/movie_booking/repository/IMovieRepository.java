package com.example.movie_booking.repository;

import com.example.movie_booking.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IMovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByStatusFilmId_Id(int statusId);
    Movie findByIdAndStatusFilmId_Id(Long id, int statusId);

    Long countByStatusFilmId_Name(String name);
        @Query("SELECT m FROM Movie m WHERE m.statusFilmId.id IN (:statusIds)")
        List<Movie> findByStatusFilmIds(@Param("statusIds") List<Long> statusIds);



}
