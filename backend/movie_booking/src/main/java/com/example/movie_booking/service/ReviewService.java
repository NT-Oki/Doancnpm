package com.example.movie_booking.service;

import com.example.movie_booking.dto.SentimentResponseDTO;
import com.example.movie_booking.dto.request.ReviewRequestDTO;
import com.example.movie_booking.model.Review;
import com.example.movie_booking.repository.IReviewRepository;
import com.example.movie_booking.service.ai.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final IReviewRepository reviewRepository;
    private final ChatService chatService;
    private final MovieService movieService;
    private final UserService userService;

    public long addReview(ReviewRequestDTO reviewRequestDTO){
        SentimentResponseDTO sentimentResponseDTO = chatService.getSentimentAssessment(reviewRequestDTO.getComment(), reviewRequestDTO.getRating());
        Review review = Review.builder()
                .comment(reviewRequestDTO.getComment())
                .rating(reviewRequestDTO.getRating())
                .movie(movieService.findById(reviewRequestDTO.getMovieId()).get())
                .user(userService.findById(reviewRequestDTO.getUserId()))
                .sentiment(sentimentResponseDTO.getSentiment())
                .sentimentScore(sentimentResponseDTO.getScore())
                .build();
        reviewRepository.save(review);
        return review.getId();
    }

    public void updateReview(long id,ReviewRequestDTO reviewRequestDTO){
        SentimentResponseDTO sentimentResponseDTO = chatService.getSentimentAssessment(reviewRequestDTO.getComment(), reviewRequestDTO.getRating());
        Review review = reviewRepository.findById(id).get();
        review.setComment(reviewRequestDTO.getComment());
        review.setRating(reviewRequestDTO.getRating());
        review.setSentiment(sentimentResponseDTO.getSentiment());
        review.setSentimentScore(sentimentResponseDTO.getScore());
        reviewRepository.save(review);
    }

}
