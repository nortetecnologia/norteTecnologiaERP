import { loginAction } from "./actions";

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
  const params = await searchParams;
  if (!params.error) return null;
  return (
    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
      {params.error === "rate_limit"
        ? "Muitas tentativas. Aguarde 15 minutos."
        : "E-mail ou senha incorretos."}
    </div>
  );
}
