type ClasseNBR = "I" | "II_A" | "II_B"

interface BadgeProps {
  classe: ClasseNBR
}

export default function Badge({ classe }: BadgeProps) {
  const styles: Record<ClasseNBR, string> = {
    "I": "bg-red-100 text-red-700 border border-red-400",
    "II_A": "bg-yellow-100 text-yellow-700 border border-yellow-400",
    "II_B": "bg-green-100 text-green-700 border border-green-400",
  }

  const labels: Record<ClasseNBR, string> = {
    "I": "Classe I",
    "II_A": "Classe II-A",
    "II_B": "Classe II-B",
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[classe]}`}>
      {labels[classe]}
    </span>
  )
}