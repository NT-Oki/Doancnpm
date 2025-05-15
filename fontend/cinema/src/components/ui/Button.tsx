"use client"

import type { ReactNode } from "react"

interface ButtonProps {
    type?: "button" | "submit" | "reset"
    variant?: "primary" | "secondary" | "outline"
    children: ReactNode
    onClick?: () => void
    disabled?: boolean
    fullWidth?: boolean
    className?: string
    isLoading?: boolean
}

export const Button = ({
                           type = "button",
                           variant = "primary",
                           children,
                           onClick,
                           disabled = false,
                           fullWidth = false,
                           className = "",
                           isLoading = false,
                       }: ButtonProps) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"

    const variantStyles = {
        primary: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
        secondary: "bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500",
        outline: "bg-transparent border border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500",
    }

    const widthClass = fullWidth ? "w-full" : ""

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${widthClass}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
        >
            {isLoading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Processing...
                </>
            ) : (
                children
            )}
        </button>
    )
}
