import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'outlined'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer'

  const styles = {
    primary: 'bg-[#005F73] text-white hover:bg-[#004558] active:bg-[#003848]',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outlined: 'border border-[#005F73] text-[#005F73] hover:bg-[#e6f4f7]',
  }

  const disabledStyle = 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${disabled ? disabledStyle : styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
