"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { FormInput } from "../../ui/FormInput"
import { FormSelect } from "../../ui/FormSelect"
import { Button } from "../../ui/Button"
import { registerUser } from "../../../api/UserAPI"
import type { UserRegisterRequest } from "../../../types/User"
import { AtSign, Lock, User, Phone } from "lucide-react"

interface FormErrors {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    gender?: string
    phoneNumber?: string
}

export const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "true",
        phoneNumber: "",
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        } else if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters"
        }

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
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        // Phone number validation
        const phoneRegex = /^\d{10}$/
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required"
        } else if (!phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Please enter a valid 10-digit phone number"
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
            const userData: UserRegisterRequest = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                gender: formData.gender === "true", // Convert string to boolean
                phoneNumber: formData.phoneNumber,
            }

            const response = await registerUser(userData)
            setSubmitResult(response)

            if (response.success) {
                // Reset form on success
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    gender: "true",
                    phoneNumber: "",
                })
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
                    id="name"
                    label="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    error={errors.name}
                    icon={<User size={18}/>}
                />

                <FormInput
                    id="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    error={errors.email}
                    icon={<AtSign size={18}/>}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        id="password"
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        error={errors.password}
                        icon={<Lock size={18}/>}
                    />

                    <FormInput
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        error={errors.confirmPassword}
                        icon={<Lock size={18}/>}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                        id="gender"
                        label="Gender"
                        value={formData.gender}
                        onChange={handleChange}
                        options={[
                            {value: "true", label: "Male"},
                            {value: "false", label: "Female"},
                        ]}
                        required
                        error={errors.gender}
                    />

                    <FormInput
                        id="phoneNumber"
                        label="Phone Number"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="1234567890"
                        required
                        error={errors.phoneNumber}
                        icon={<Phone size={18}/>}
                    />
                </div>

                <div className="mb-4">
                    <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}  className={"!bg-red-600"}>
                        Create Account
                    </Button>
                </div>

                <p className="text-center text-sm text-gray-400 mt-4">
                    Already have an account?{" "}
                    <a href="#" className="text-red-500 hover:text-red-400">
                        Sign in
                    </a>
                </p>
            </form>
        </div>
    )
}
