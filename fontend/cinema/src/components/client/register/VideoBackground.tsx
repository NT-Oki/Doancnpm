"use client"

import { useState, useEffect, useRef } from "react"

interface VideoBackgroundProps {
    videoUrl: string
    fallbackImageUrl: string
}

export const VideoBackground = ({ videoUrl, fallbackImageUrl }: VideoBackgroundProps) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const video = videoRef.current
        if (video) {
            video.addEventListener("loadeddata", () => setIsLoaded(true))
            return () => {
                video.removeEventListener("loadeddata", () => setIsLoaded(true))
            }
        }
    }, [])



    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            {/* Show fallback image until video is loaded */}
            {!isLoaded && (
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{
                        backgroundImage: `url('${fallbackImageUrl}')`,
                    }}
                ></div>
            )}

            <video
                ref={videoRef}
                className={`absolute inset-0 min-w-full min-h-full object-cover opacity-60 transition-opacity duration-1000 ${
                    isLoaded ? "opacity-60" : "opacity-0"
                }`}
                autoPlay
                muted
                loop
                playsInline
                onCanPlay={() => setIsLoaded(true)}
            >
                <source src={videoUrl} type="video/mp4" />
            </video>

            {/* Overlay gradient for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-0"></div>

            {/* Video controls */}
        </div>
    )
}
