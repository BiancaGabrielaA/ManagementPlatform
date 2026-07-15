import { Link, useNavigate } from "react-router-dom";
import { SquareKanban } from "lucide-react";
import { useState } from "react";
import { registerUser } from "@/api/auth.api";
import { AxiosError } from "axios";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const {name, value} = e.target;

    setFormData((prev) => ({...prev, [name]: value}));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if(!formData.fullName.trim()) 
      newErrors.fullName = "Full name is required";

    if(!formData.email.trim())
      newErrors.email = "Email is required";
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email address";

    if (!formData.password) 
      newErrors.password = "Password is required";
    else if (formData.password.length < 8) 
      newErrors.password = "Password must be at least 8 characters";

    if (formData.confirmPassword !== formData.password) 
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  }

  const handleSubmit = async(e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    
    if (!validate()) return;
    setIsSubmitting(true);

    try {
        await registerUser({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        navigate("/login");
    } catch(error){
      const axiosError = error as AxiosError<{ message?: string }>;
      setServerError(
        axiosError.response?.data?.message ||
          "A apărut o eroare. Te rugăm să încerci din nou."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="grid min-h-screen lg:grid-cols-2">

      <section className="relative hidden overflow-hidden bg-primary lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-indigo-700 opacity-95" />

        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <SquareKanban className="h-8 w-8" />

            <h1 className="text-3xl font-bold">
              TaskFlow
            </h1>
          </div>

          <div className="max-w-md">
            <h2 className="text-5xl font-bold leading-tight">
              Build better
              <br />
              workflows.
            </h2>

            <p className="mt-6 text-lg text-white/80">
              Create your workspace, invite your team, and start managing
              projects more efficiently.
            </p>
          </div>

          {/* Dashboard preview placeholder */}
          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
            <div className="mb-4 h-3 w-32 rounded bg-white/30" />

            <div className="space-y-3">
              <div className="h-10 rounded-xl bg-white/20" />
              <div className="h-10 rounded-xl bg-white/20" />
              <div className="h-10 rounded-xl bg-white/20" />
            </div>

            <div className="mt-6 h-32 rounded-2xl bg-white/20" />
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center bg-slate-50 px-8">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-slate-900">Create your account</h2>
          <p className="mt-3 text-slate-600">Join TaskFlow and start organizing your projects today.</p>

          {serverError && (
            <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}
          <form className="mt-10 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-primary"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-primary"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-primary"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-primary"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:opacity-90"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>

          <Link
            to="/"
            className="mt-8 block text-center text-sm text-slate-500 transition hover:text-primary"
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;