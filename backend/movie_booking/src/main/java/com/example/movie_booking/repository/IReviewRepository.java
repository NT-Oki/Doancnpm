package com.example.movie_booking.repository;

import com.example.movie_booking.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IReviewRepository extends JpaRepository<Review, Long> {

}
