import * as React from "react"

export function Card({ className = "", children, ...props }) {
  return (
    <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`} {...props}>
      {children}
    </div>
  )
} 