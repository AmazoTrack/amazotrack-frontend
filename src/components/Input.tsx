interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  type?: string
}

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  error = '',
  type = 'text',
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-all ${
          error
            ? 'border-red-400 focus:ring-red-200'
            : 'border-gray-300 focus:ring-[#005F73]/20 focus:border-[#005F73]'
        }`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
