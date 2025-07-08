package com.example.movie_booking.repository;

import com.example.movie_booking.dto.MovieSentimentProjection;
import com.example.movie_booking.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findReviewsByMovieId(long movieId);

    @Query(value = """
        SELECT 
            m.id AS movieId,
            m.name_movie AS movieName,
            m.avatar AS avatar,
            COALESCE(AVG(r.sentiment_core), -1) AS averageSentimentScore
        FROM 
            movie m
        LEFT JOIN 
            reviews r ON m.id = r.movie_id
        GROUP BY 
            m.id, m.name_movie, m.avatar
        ORDER BY 
            averageSentimentScore DESC
        """, nativeQuery = true)
    List<MovieSentimentProjection> findAllMovieWithSentimentScore();

}
