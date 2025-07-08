export interface MovieSentimentDTO {
    movieId: number
    movieName: string
    avatar: string
    averageSentimentScore: number
}

export interface ReviewResponse {
    id: number
    movieId: number
    userId: number
    email: string
    avatar: string
    rating: number
    sentiment: string
    sentimentScore: number
    comment: string
    updatedAt: string
}
