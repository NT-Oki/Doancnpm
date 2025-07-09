package com.example.movie_booking.service;

import com.example.movie_booking.dto.MovieSentimentDTO;
import com.example.movie_booking.dto.ReviewResponse;
import com.example.movie_booking.dto.SentimentResponseDTO;
import com.example.movie_booking.dto.request.ReviewRequestDTO;
import com.example.movie_booking.model.Movie;
import com.example.movie_booking.model.Review;
import com.example.movie_booking.repository.IBookingRepository;
import com.example.movie_booking.repository.IReviewRepository;
import com.example.movie_booking.service.ai.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final IReviewRepository reviewRepository;
    private final ChatService chatService;
    private final MovieService movieService;
    private final UserService userService;
    private final IBookingRepository bookingRepository;

    public long addReview(ReviewRequestDTO reviewRequestDTO){
//        if(!bookingRepository.existsByUserIdAndBookingStatus_Id(reviewRequestDTO.getUserId(), reviewRequestDTO.getMovieId())) throw new RuntimeException();
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

    public List<ReviewResponse> getListReviews(){
        List<Review> reviews = reviewRepository.findAll();
        List<ReviewResponse> responses = reviews.stream().map(review -> ReviewResponse.builder()
                .id(review.getId())
                .movieId(review.getMovie().getId())
                .userId(review.getUser().getId())
                .email(review.getUser().getEmail())
                .avatar(review.getUser().getAvatar())
                .rating(review.getRating())
                .sentimentScore(review.getSentimentScore())
                .sentiment(review.getSentiment())
                .comment(review.getComment())
                .updatedAt(review.getUpdatedAt())
                .build()).toList();
        return responses;
    }

    public List<ReviewResponse> getListReviewsByMovieId(long movieId){
        List<Review> reviews = reviewRepository.findReviewsByMovieId(movieId);
        List<ReviewResponse> responses = reviews.stream().map(review -> ReviewResponse.builder()
                .id(review.getId())
                .movieId(review.getMovie().getId())
                .userId(review.getUser().getId())
                .email(review.getUser().getEmail())
                .avatar(review.getUser().getAvatar())
                .rating(review.getRating())
                .sentimentScore(review.getSentimentScore())
                .sentiment(review.getSentiment())
                .comment(review.getComment())
                .updatedAt(review.getUpdatedAt())
                .build()).toList();
        return responses;
    }
    public List<MovieSentimentDTO> getListMoviesSentiment(){
        List<MovieSentimentDTO> result = reviewRepository.findAllMovieWithSentimentScore()
                .stream()
                .map(p -> MovieSentimentDTO.builder()
                        .movieId(p.getMovieId())
                        .movieName(p.getMovieName())
                        .avatar(p.getAvatar())
                        .averageSentimentScore(p.getAverageSentimentScore())
                        .build())
                .toList();
        return result;
    }

    public boolean checkPermissionReview(int userId, int movieId){
        return bookingRepository.existsByUserIdAndBookingStatus_Id((long) userId, (long) movieId);
    }

}
