import * as React from "react"

export function Form({ className = "", children, ...props }) {
  return (
    <form className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  )
}

// Unified form field for label, error, and input
export function ShadcnFormField({
  label,
  htmlFor,
  error,
  children,
  className = "",
  labelClassName = "",
  labelStyle = {},
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={`block text-sm font-medium text-gray-700 dark:text-white ${labelClassName}`}
          style={labelStyle}
        >
          {label}
        </label>
      )}
      {children}
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </div>
  );
} 