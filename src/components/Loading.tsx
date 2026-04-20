interface LoadingProps {
  type?: "spinner" | "skeleton"
}

export default function Loading({ type = "spinner" }: LoadingProps) {
  if (type === "skeleton") {
    return (
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}