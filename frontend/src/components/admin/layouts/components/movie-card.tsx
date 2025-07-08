import '../../pages/utilcss.css'; // hoặc './global.css'

import { Card, CardContent } from "../../ui/card"
import { Badge } from "../../ui/badge"
import type { MovieSentimentDTO } from "./movie-sentiment"
import { getSentimentLabel, getSentimentDisplayText, hasSentimentData } from "./sentiment-bar"
import SentimentBar from "./sentiment-bar"
import { MessageSquareX } from "lucide-react"

interface MovieCardProps {
    movie: MovieSentimentDTO
    onClick: (movieId: number) => void
}

interface MovieCardProps {
    movie: MovieSentimentDTO
    onClick: (movieId: number) => void
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
    const sentimentLabel = getSentimentLabel(movie.averageSentimentScore)
    const displayText = getSentimentDisplayText(movie.averageSentimentScore)
    const hasData = hasSentimentData(movie.averageSentimentScore)

    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => onClick(movie.movieId)}
        >
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <img
                            src={movie.avatar || "/placeholder.svg?height=120&width=80"}
                            alt={movie.movieName}
                            className="w-20 h-30 rounded-lg object-cover shadow-md"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{movie.movieName}</h3>
                        <div className="mb-3">
                            <Badge
                                variant={
                                    !hasData
                                        ? "outline"
                                        : movie.averageSentimentScore >= 0.7
                                            ? "default"
                                            : movie.averageSentimentScore >= 0.4
                                                ? "secondary"
                                                : "destructive"
                                }
                                className="mb-2"
                            >
                                {!hasData && <MessageSquareX className="w-3 h-3 mr-1" />}
                                {sentimentLabel} ({displayText})
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Cảm xúc khán giả</span>
                                <span className="font-medium">{displayText}</span>
                            </div>
                            <SentimentBar score={movie.averageSentimentScore} showLabel={false} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
