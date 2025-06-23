
import type { ChangeEvent } from "react"

interface Option {
    value: string
    label: string
}

interface FormSelectProps {
    id: string
    label: string
    value: string
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
    options: Option[]
    required?: boolean
    error?: string
}

export const FormSelect = ({ id, label, value, onChange, options, required = false, error }: FormSelectProps) => {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium mb-1 text-gray-200">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <select
                id={id}
                value={value}
                onChange={onChange}
                className={`
          block w-full rounded-md bg-gray-800 border-gray-700 
          px-4 py-3 text-gray-100
          focus:ring-2 focus:ring-red-500 focus:outline-none
          ${error ? "border-red-500" : "border-gray-700"}
        `}
                required={required}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    )
}
