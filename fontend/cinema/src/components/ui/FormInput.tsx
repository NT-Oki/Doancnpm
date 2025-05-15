
import type React from "react"

import { type ChangeEvent, useState } from "react"

interface FormInputProps {
    id: string
    label: string
    type: string
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    required?: boolean
    error?: string
    icon?: React.ReactNode
}

export const FormInput = ({
                              id,
                              label,
                              type,
                              value,
                              onChange,
                              placeholder,
                              required = false,
                              error,
                              icon,
                          }: FormInputProps) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium mb-1 text-gray-200">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className={`relative rounded-md shadow-sm ${error ? "ring-1 ring-red-500" : ""}`}>
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}

                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
            block w-full rounded-md bg-gray-800 border-gray-700 
            ${icon ? "pl-10" : "pl-4"} pr-4 py-3 
            text-gray-100 placeholder-gray-500
            focus:ring-2 focus:outline-none transition-all duration-200
            ${isFocused ? "focus:ring-red-500" : ""}
            ${error ? "border-red-500" : "border-gray-700"}
          `}
                    placeholder={placeholder}
                    required={required}
                />
            </div>

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    )
}
