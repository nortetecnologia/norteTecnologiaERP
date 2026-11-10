import { loginAction } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "E-mail ou senha incorretos.",
  rate_limit: "Muitas tentativas. Aguarde 15 minutos.",
  unauthorized: "Seu usuário não tem acesso ao sistema ERP. Contate o administrador.",
  forbidden: "Você não tem permissão para executar esta ação.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand-yellow rounded-xl flex items-center justify-center font-black text-brand-black text-2xl mb-4">
            NT
          </div>
          <h1 className="text-xl font-bold text-white">Norte Tecnologia</h1>
          <p className="text-sm text-gray-500 mt-1">Sistema de Gestão (ERP)</p>
        </div>

        <ErrorBanner searchParams={searchParams} />

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">E-mail</label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full bg-brand-gray-dark border border-brand-gray-mid rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-yellow transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Senha</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full bg-brand-gray-dark border border-brand-gray-mid rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-yellow transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black font-bold py-2.5 rounded-lg transition-colors text-sm mt-2"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

async function ErrorBanner({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (!error) return null;

  const message = ERROR_MESSAGES[error] ?? "Ocorreu um erro. Tente novamente.";
  const isUnauthorized = error === "unauthorized" || error === "forbidden";

  return (
    <div
      className={`mb-4 p-3 rounded-lg text-sm border ${
        isUnauthorized
          ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
          : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}
    >
      {message}
    </div>
  );
}
