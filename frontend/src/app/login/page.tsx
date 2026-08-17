import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] px-5 py-8 text-neutral-950">
      <div className="mx-auto max-w-md rounded border border-neutral-200 bg-white p-6">
        <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-950">
          Back
        </Link>
        <h1 className="mt-6 text-2xl font-semibold">Login</h1>
        <form className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-neutral-700">Email or username</span>
            <input
              className="mt-2 h-11 w-full rounded border border-neutral-300 px-3 outline-none focus:border-neutral-900"
              name="identifier"
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-neutral-700">Password</span>
            <input
              className="mt-2 h-11 w-full rounded border border-neutral-300 px-3 outline-none focus:border-neutral-900"
              name="password"
              type="password"
              autoComplete="current-password"
            />
          </label>
          <button className="h-11 w-full rounded bg-neutral-950 px-4 text-sm font-semibold text-white hover:bg-neutral-800">
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
