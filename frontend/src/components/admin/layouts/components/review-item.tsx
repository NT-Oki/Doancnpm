import { Card, CardContent } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Star, User } from "lucide-react"
import type { ReviewResponse } from "./movie-sentiment"
import { getSentimentLabel, formatSentimentPercentage } from "./sentiment-bar.tsx"
import SentimentBar from "./sentiment-bar"
import '../../pages/utilcss.css';
interface ReviewItemProps {
    review: ReviewResponse
}

export default function ReviewItem({ review }: ReviewItemProps) {
    const sentimentPercentage = formatSentimentPercentage(review.sentimentScore)
    const sentimentLabel = getSentimentLabel(review.sentimentScore)

    return (
        <Card className="mb-4">
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        {review.avatar ? (
                            <img
                                src={review.avatar || "/images/example.jpg"}
                                width={300}
                                height={200}
                                alt="Example"
                            />

                        ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-gray-500" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{review.email}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(review.updatedAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                        />
                                    ))}
                                </div>
                                <Badge
                                    variant={
                                        review.sentimentScore >= 0.7
                                            ? "default"
                                            : review.sentimentScore >= 0.4
                                                ? "secondary"
                                                : "destructive"
                                    }
                                >
                                    {sentimentLabel}
                                </Badge>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Điểm cảm xúc</span>
                                <span className="font-medium">{sentimentPercentage}%</span>
                            </div>
                            <SentimentBar score={review.sentimentScore} size="sm" showLabel={false} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
