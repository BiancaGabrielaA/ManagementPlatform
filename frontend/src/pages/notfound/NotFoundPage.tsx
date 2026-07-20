import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-7xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900">
        Page Not Found
      </h2>
      <p className="mt-2 text-slate-600">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
      >
        Back to Home
      </Link>
    </main>
  );
}

export default NotFoundPage;