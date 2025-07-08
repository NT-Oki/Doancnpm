
interface SentimentBarProps {
    score: number
    size?: "sm" | "md" | "lg"
    showLabel?: boolean
}

export default function SentimentBar({ score, size = "md", showLabel = true }: SentimentBarProps) {
    const percentage = formatSentimentPercentage(score)
    const colorClass = getSentimentColor(score)
    const hasData = hasSentimentData(score)
    const displayText = getSentimentDisplayText(score)

    const heightClass = {
        sm: "h-2",
        md: "h-3",
        lg: "h-4",
    }[size]

    return (
        <div className="w-full">
            <div className={`w-full bg-gray-200 rounded-full ${heightClass} overflow-hidden`}>
                {hasData ? (
                    <div
                        className={`${colorClass} ${heightClass} rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${percentage}%` }}
                    />
                ) : (
                    <div
                        className={`${colorClass} ${heightClass} rounded-full w-full opacity-50 flex items-center justify-center`}
                    >
                        <span className="text-xs text-white font-medium">Chưa có dữ liệu</span>
                    </div>
                )}
            </div>
            {showLabel && (
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>0%</span>
                    <span className="font-medium">{displayText}</span>
                    <span>100%</span>
                </div>
            )}
        </div>
    )
}

export const getSentimentColor = (score: number): string => {
    if (score === -1) return "bg-gray-400"
    if (score >= 0.7) return "bg-green-500"
    if (score >= 0.4) return "bg-yellow-500"
    return "bg-red-500"
}

// Update the sentiment label function to handle -1 case
export const getSentimentLabel = (score: number): string => {
    if (score === -1) return "Chưa có đánh giá"
    if (score >= 0.7) return "Tích cực"
    if (score >= 0.4) return "Trung tính"
    return "Tiêu cực"
}

export const formatSentimentPercentage = (score: number): number => {
    if (score === -1) return 0
    return Math.round(score * 100)
}

// Add new utility function to check if sentiment data is available
export const hasSentimentData = (score: number): boolean => {
    return score !== -1
}

// Add function to get display text for sentiment percentage
export const getSentimentDisplayText = (score: number): string => {
    if (score === -1) return "N/A"
    return `${Math.round(score * 100)}%`
}
