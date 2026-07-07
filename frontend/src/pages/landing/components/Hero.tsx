function Hero() {
  return (
    <div className="mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
      <span className="mb-6 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
        🚀 Organize your work smarter
      </span>

      <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
        Project management
        <span className="text-primary"> made simple.</span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        Organize projects, manage tasks, collaborate with your team, and
        track progress—all in one intuitive workspace designed to keep
        everyone productive.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <button className="rounded-xl bg-primary px-8 py-3 font-semibold text-white transition hover:opacity-90">
          Start for Free
        </button>

        <button className="rounded-xl border border-slate-300 px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">
          View Demo
        </button>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
        <span>✓ Unlimited projects</span>
        <span>✓ Team collaboration</span>
        <span>✓ Real-time updates</span>
      </div>
    </div>
  );
}

export default Hero;