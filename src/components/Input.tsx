interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  type?: string      
  required?: boolean  
  className?: string // 1. Adicionamos o className como opcional aqui
}

export default function Input({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  error = "", 
  type = "text",      
  required = false,
  className = ""     // 2. Recebemos ele aqui (vazio por padrão)
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
        required={required}   
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        // 3. Injetamos o className no final para sobrescrever ou adicionar estilos
        className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 
          ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:border-[#005F73] focus:ring-[#005F73]/20"} 
          ${className}`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}