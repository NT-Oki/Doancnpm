import { LoginForm } from "./LoginForm"
import { VideoBackground } from "../register/VideoBackground"

export const LoginPage = () => {
    return (

            <div className="min-h-screen flex flex-col md:flex-row">
                {/* Left side - Movie themed background with video */}
                <div className="hidden md:flex md:w-1/2 bg-black relative overflow-hidden">
                    <VideoBackground
                        videoUrl="https://assets.mixkit.co/videos/preview/mixkit-watching-a-movie-in-a-living-room-4809-large.mp4"
                        fallbackImageUrl="https://preview.redd.it/what-has-happened-to-movie-posters-v0-veyma8wnnhb81.jpg?width=640&crop=smart&auto=webp&s=3155408077eb1f8e3f8c4566b44e51204bc09ba9"
                    />

                    <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
                        <div className="max-w-md text-center">
                            <h1 className="text-4xl font-bold mb-4 text-red-500">Movie </h1>
                            <p className="text-xl mb-8">Welcome back to the ultimate movie experience</p>

                            {/* Film strip decoration with animation */}
                            <div className="flex space-x-2 justify-center mb-8 film-strip">
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-4 h-16 bg-gray-800 rounded-sm transition-all duration-500"
                                        style={{animationDelay: `${i * 0.1}s`}}
                                    ></div>
                                ))}
                            </div>

                            <div
                                className="bg-black/70 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-xl">
                                <h2 className="text-2xl font-semibold mb-4">Movie Highlights</h2>

                                <div className="space-y-4">
                                    <div className="bg-gray-800/50 p-3 rounded-md">
                                        <h3 className="font-medium text-red-400">Now Showing</h3>
                                        <p className="text-sm text-gray-300">The latest blockbusters and indie gems</p>
                                    </div>

                                    <div className="bg-gray-800/50 p-3 rounded-md">
                                        <h3 className="font-medium text-red-400">Coming Soon</h3>
                                        <p className="text-sm text-gray-300">Pre-book tickets for upcoming releases</p>
                                    </div>

                                    <div className="bg-gray-800/50 p-3 rounded-md">
                                        <h3 className="font-medium text-red-400">Special Events</h3>
                                        <p className="text-sm text-gray-300">Film festivals and exclusive screenings</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Login form */}
                <div className="w-full md:w-1/2 bg-gray-900 flex items-center justify-center p-6 md:p-12">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white">Sign In</h2>
                            <p className="text-gray-400 mt-2">Access your Movie account</p>
                        </div>

                        <LoginForm />
                    </div>
                </div>
            </div>
    )
}
