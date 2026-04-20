interface ErrorPageProps {
  type?: "404" | "api"
}

export default function ErrorPage({ type = "404" }: ErrorPageProps) {
  const errors = {
    "404": {
      code: "404",
      title: "Página não encontrada",
      message: "A página que você tentou acessar não existe ou foi removida.",
    },
    "api": {
      code: "Erro",
      title: "Erro de conexão",
      message: "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
    },
  }

  const error = errors[type]

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-4">
      <span className="text-8xl font-bold text-blue-600">{error.code}</span>
      <h1 className="text-2xl font-semibold text-gray-800">{error.title}</h1>
      <p className="text-gray-500">{error.message}</p>
      <a href="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Voltar para o início
      </a>
    </div>
  )
}