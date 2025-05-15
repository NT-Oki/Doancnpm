import axios from "axios"
import type {UserLoginRequest, UserRegisterRequest} from "../types/User"

// Create axios instance with base URL
export const api = axios.create({
    baseURL: "https://api.example.com", // Replace with your actual API URL
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
})

// Registration API service
export const registerUser = async (userData: UserRegisterRequest) => {
    try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // For demo purposes, we'll simulate a successful response
        // In a real app, you would use: const response = await api.post('/auth/register', userData);

        console.log("Registration data sent:", userData)

        return {
            success: true,
            message: "Registration successful! Welcome to MovieTix.",
        }

        // Uncomment for testing error scenarios:
        // throw new Error('Network error');
    } catch (error) {
        console.error("Registration error:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Registration failed. Please try again.",
        }
    }
}
export const loginUser = async (loginData: UserLoginRequest) => {
    try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, we'll simulate a successful response
        // In a real app, you would use: const response = await api.post('/auth/login', loginData);

        console.log("Login data sent:", loginData)

        // Simulate validation
        if (loginData.email === "demo@example.com" && loginData.password === "password") {
            return {
                success: true,
                message: "Login successful! Redirecting to dashboard...",
                data: {
                    token: "sample-jwt-token",
                    user: {
                        id: "123",
                        name: "Demo User",
                        email: loginData.email,
                    },
                },
            }
        }

        // For demo purposes, allow any login
        return {
            success: true,
            message: "Login successful! Welcome back to MovieTix.",
            data: {
                token: "sample-jwt-token",
                user: {
                    id: "user-" + Math.random().toString(36).substr(2, 9),
                    email: loginData.email,
                },
            },
        }

        // Uncomment for testing error scenarios:
        // throw new Error('Invalid credentials');
    } catch (error) {
        console.error("Login error:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Login failed. Please check your credentials.",
        }
    }
}