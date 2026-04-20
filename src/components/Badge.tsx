type ClasseNBR = "I-A" | "II-A" | "II-B"

interface BadgeProps {
  classe: ClasseNBR
}

export default function Badge({ classe }: BadgeProps) {
  const styles: Record<ClasseNBR, string> = {
    "I-A": "bg-red-100 text-red-700 border border-red-400",
    "II-A": "bg-yellow-100 text-yellow-700 border border-yellow-400",
    "II-B": "bg-green-100 text-green-700 border border-green-400",
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[classe]}`}>
      {classe}
    </span>
  )
}