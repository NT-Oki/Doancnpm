"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { FormInput } from "../../ui/FormInput"
import { Button } from "../../ui/Button"
import { loginUser } from "../../../api/UserAPI"
import type { UserLoginRequest} from "../../../types/User.ts"
import { AtSign, Lock } from "lucide-react"

interface FormErrors {
    email?: string
    password?: string
}

export const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        setSubmitResult(null)

        try {
            // Convert form data to API request format
            const loginData: UserLoginRequest = {
                email: formData.email,
                password: formData.password,
                rememberMe: formData.rememberMe,
            }

            const response = await loginUser(loginData)
            setSubmitResult(response)

            if (response.success) {
                // In a real app, you would store the token and redirect the user
                console.log("Login successful, token:", response.data?.token)

                // Simulate redirect after successful login
                setTimeout(() => {
                    // window.location.href = '/dashboard';
                    console.log("Redirecting to dashboard...")
                }, 1500)
            }
        } catch (error) {

            let message = "An unexpected error occurred."

            if (error instanceof Error) {
                message = error.message
            }

            setSubmitResult({
                success: false,
                message: message,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full max-w-md">
            {submitResult && (
                <div
                    className={`mb-6 p-4 rounded-md ${
                        submitResult.success ? "bg-green-800/50 text-green-200" : "bg-red-800/50 text-red-200"
                    }`}
                >
                    {submitResult.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    id="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    error={errors.email}
                    icon={<AtSign size={18} />}
                />

                <FormInput
                    id="password"
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    error={errors.password}
                    icon={<Lock size={18} />}
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="rememberMe"
                            name="rememberMe"
                            type="checkbox"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-700 rounded bg-gray-800"
                        />
                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                            Remember me
                        </label>
                    </div>
                    <div className="text-sm">
                        <a href="#" className="text-red-500 hover:text-red-400">
                            Forgot your password?
                        </a>
                    </div>
                </div>

                <div className="mt-8">
                    <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting} className={"!bg-red-600"}>
                        Sign In
                    </Button>
                </div>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path
                                    fillRule="evenodd"
                                    d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path
                                    fillRule="evenodd"
                                    d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm-1.786 15.263h-2.68V7.53h2.68v7.734zm-1.34-8.786c-.858 0-1.397-.565-1.397-1.27 0-.715.565-1.256 1.436-1.256.857 0 1.396.56 1.396 1.27 0 .704-.565 1.255-1.435 1.255zm10.266 8.786h-2.68v-4.135c0-1.103-.394-1.856-1.378-1.856-.752 0-1.2.508-1.397.996-.072.175-.09.42-.09.665v4.33h-2.68V9.594c0-1.064-.036-1.953-.072-2.72h2.328l.122 1.18h.054c.36-.554 1.243-1.378 2.72-1.378 1.8 0 3.15 1.2 3.15 3.778v4.808z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Don't have an account?{" "}
                    <a href="#" className="text-red-500 hover:text-red-400">
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    )
}
