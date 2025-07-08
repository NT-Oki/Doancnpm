package com.example.movie_booking.controller;

import com.example.movie_booking.dto.request.ReviewRequestDTO;
import com.example.movie_booking.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/")
    public ResponseEntity<?> saveReview(@RequestBody ReviewRequestDTO review) {
        return ResponseEntity.ok(reviewService.addReview(review));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable int id ,@RequestBody ReviewRequestDTO review) {
        reviewService.updateReview(id, review);
        return ResponseEntity.ok().body("OK");
    }

    @GetMapping("/list")
    public ResponseEntity<?> getListReviews(){
        return ResponseEntity.ok(reviewService.getListReviews());
    }

    @GetMapping("/list-by-movie/{id}")
    public ResponseEntity<?> getListReviewsByMovieId(@PathVariable long id){

        return ResponseEntity.ok(reviewService.getListReviewsByMovieId(id));
    }

    @GetMapping("/list-movie-sentiment")
    public ResponseEntity<?> getListMovieSentiment(){
        return ResponseEntity.ok(reviewService.getListMoviesSentiment());
    }

}
