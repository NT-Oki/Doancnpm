import { RegistrationForm } from "./RegistrationForm"
import { VideoBackground } from "./VideoBackground"

export const RegistrationPage = () => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side - Movie themed background with video */}
            <div className="hidden md:flex md:w-1/2 bg-black relative overflow-hidden">
                <VideoBackground
                    videoUrl=""
                    fallbackImageUrl="https://preview.redd.it/what-has-happened-to-movie-posters-v0-veyma8wnnhb81.jpg?width=640&crop=smart&auto=webp&s=3155408077eb1f8e3f8c4566b44e51204bc09ba9"
                />

                <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
                    <div className="max-w-md text-center">
                        <h1 className="text-4xl font-bold mb-4 text-red-500">Movie</h1>
                        <p className="text-xl mb-8">Your gateway to cinematic experiences</p>

                        {/* Film strip decoration with animation */}
                        <div className="flex space-x-2 justify-center mb-8 film-strip">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-4 h-16 bg-gray-800 rounded-sm transition-all duration-500"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                ></div>
                            ))}
                        </div>

                        <div className="bg-black/70 backdrop-blur-sm p-6 rounded-lg border border-gray-800 shadow-xl">
                            <h2 className="text-2xl font-semibold mb-4">Join Movie Today</h2>
                            <ul className="text-left space-y-3">
                                <li className="flex items-center">
                                    <span className="mr-2 text-red-500 text-xl">✓</span> Book tickets for the latest movies
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2 text-red-500 text-xl">✓</span> Get exclusive discounts and offers
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2 text-red-500 text-xl">✓</span> Earn rewards with every booking
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2 text-red-500 text-xl">✓</span> Receive updates on upcoming releases
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Registration form */}
            <div className="w-full md:w-1/2 bg-gray-900 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white">Create Your Account</h2>
                        <p className="text-gray-400 mt-2">Sign up to start booking movie tickets</p>
                    </div>

                    <RegistrationForm />
                </div>
            </div>
        </div>
    )
}
