import './utilcss.css'

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { ArrowLeft, BarChart3, MessageSquare, MessageSquareX } from "lucide-react"
import type { MovieSentimentDTO, ReviewResponse } from "../layouts/components/movie-sentiment.ts"
import MovieCard from "../layouts/components/movie-card"
import ReviewItem from "../layouts/components/review-item"
import SentimentBar from "../layouts/components/sentiment-bar"
// Import the new utility functions
import { getSentimentLabel, getSentimentDisplayText, hasSentimentData } from "../layouts/components/sentiment-bar.tsx"
import axios from "axios";
import API_URLS from "../../../config/api.ts"

const fetchMovieSentiments = async (): Promise<MovieSentimentDTO[]> => {
    try {
        const response = await axios.get(API_URLS.REVIEW.getListMovieSestiments);
        return response.data;
    } catch (error) {
        console.error("Error fetching movie sentiments:", error);
        return []; // hoặc throw error nếu muốn xử lý ở nơi gọi
    }
}

const fetchMovieReviews = async (movieId: number): Promise<ReviewResponse[]> => {
    try {
        const response = await axios.get(API_URLS.REVIEW.getListReviewsByMovieId(movieId));
        return response.data;
    } catch (error) {
        console.error(`Error fetching reviews for movieId ${movieId}:`, error);
        return [];
    }
}
export default function MovieSentimentAdmin() {
    const [movies, setMovies] = useState<MovieSentimentDTO[]>([])
    const [selectedMovie, setSelectedMovie] = useState<MovieSentimentDTO | null>(null)
    const [reviews, setReviews] = useState<ReviewResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [reviewsLoading, setReviewsLoading] = useState(false)

    useEffect(() => {
        loadMovies()
    }, [])

    const loadMovies = async () => {
        try {
            setLoading(true)
            const data = await fetchMovieSentiments()
            setMovies(data)
        } catch (error) {
            console.error("Error loading movies:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleMovieClick = async (movieId: number) => {
        const movie = movies.find((m) => m.movieId === movieId)
        if (!movie) return

        setSelectedMovie(movie)
        setReviewsLoading(true)

        try {
            const reviewData = await fetchMovieReviews(movieId)
            setReviews(reviewData)
        } catch (error) {
            console.error("Error loading reviews:", error)
        } finally {
            setReviewsLoading(false)
        }
    }

    const handleBackToMovies = () => {
        setSelectedMovie(null)
        setReviews([])
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải phim...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {!selectedMovie ? (
                    // Movies Dashboard
                    <>
                        <div className="mb-8">
                            <div className="flex items-center space-x-3 mb-4">
                                <BarChart3 className="w-8 h-8 text-blue-600" />
                                <h1 className="text-3xl font-bold text-gray-900">Bảng Điều Khiển Cảm Xúc Phim</h1>
                            </div>
                            <p className="text-gray-600">
                                Theo dõi cảm xúc khán giả và đánh giá cho tất cả các bộ phim. Nhấp vào bất kỳ bộ phim nào để xem đánh
                                giá chi tiết.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {movies.map((movie) => (
                                <MovieCard key={movie.movieId} movie={movie} onClick={handleMovieClick} />
                            ))}
                        </div>
                    </>
                ) : (
                    // Movie Reviews Detail
                    <>
                        <div className="mb-6">
                            <Button variant="ghost" onClick={handleBackToMovies} className="mb-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại Danh sách Phim
                            </Button>

                            <Card className="mb-6">
                                <CardHeader>
                                    <div className="flex items-start space-x-6">
                                        <img
                                            src={selectedMovie.avatar || "/placeholder.svg?height=160&width=120"}
                                            alt={selectedMovie.movieName}
                                            className="w-24 h-36 object-cover rounded-lg shadow-md"
                                        />
                                        <div className="flex-1">
                                            <CardTitle className="text-2xl mb-2">{selectedMovie.movieName}</CardTitle>
                                            <div className="flex items-center space-x-4 mb-4">
                                                <Badge
                                                    variant={
                                                        !hasSentimentData(selectedMovie.averageSentimentScore)
                                                            ? "outline"
                                                            : selectedMovie.averageSentimentScore >= 0.7
                                                                ? "default"
                                                                : selectedMovie.averageSentimentScore >= 0.4
                                                                    ? "secondary"
                                                                    : "destructive"
                                                    }
                                                    className="text-sm"
                                                >
                                                    {!hasSentimentData(selectedMovie.averageSentimentScore) && (
                                                        <MessageSquareX className="w-3 h-3 mr-1" />
                                                    )}
                                                    {getSentimentLabel(selectedMovie.averageSentimentScore)} (
                                                    {getSentimentDisplayText(selectedMovie.averageSentimentScore)})
                                                </Badge>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span>{reviews.length} Đánh giá</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Cảm xúc tổng thể của khán giả</span>
                                                    <span className="font-medium">
                            {getSentimentDisplayText(selectedMovie.averageSentimentScore)}
                          </span>
                                                </div>
                                                <SentimentBar score={selectedMovie.averageSentimentScore} size="lg" showLabel={false} />
                                                {!hasSentimentData(selectedMovie.averageSentimentScore) && (
                                                    <p className="text-sm text-gray-500 italic mt-2">
                                                        Phim này chưa có đánh giá nào từ khán giả. Hãy là người đầu tiên đánh giá!
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 mb-4">
                                <MessageSquare className="w-6 h-6 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Đánh giá & Bình luận</h2>
                            </div>

                            {reviewsLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Đang tải đánh giá...</p>
                                </div>
                            ) : reviews.length > 0 ? (
                                reviews.map((review) => <ReviewItem key={review.id} review={review} />)
                            ) : (
                                <Card>
                                    <CardContent className="text-center py-8">
                                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">Không có đánh giá nào cho bộ phim này.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
