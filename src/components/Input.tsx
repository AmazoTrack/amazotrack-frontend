interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export default function Input({ label, placeholder, value, onChange, error = "" }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 
          ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  )
}