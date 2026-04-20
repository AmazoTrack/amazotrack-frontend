interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "danger"
  disabled?: boolean
}

export default function Button({ children, onClick, variant = "primary", disabled = false }: ButtonProps) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    disabled: "bg-gray-300 text-gray-400 cursor-not-allowed",
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition ${disabled ? styles.disabled : styles[variant]}`}
    >
      {children}
    </button>
  )
}