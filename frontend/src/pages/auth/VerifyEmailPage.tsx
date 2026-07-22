import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../api/auth.api";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message);
      })
      .catch(() => {
        setStatus("error");
        setMessage("This verification link is invalid or has expired.");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 text-center">
        {status === "loading" && <p className="text-sm text-slate-500">Verifying your email...</p>}

        {status === "success" && (
          <>
            <p className="text-sm text-emerald-600 bg-emerald-50 rounded-md px-3 py-2 mb-4">
              {message}
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full text-sm font-medium bg-slate-900 text-white px-3 py-2 rounded-md hover:bg-slate-800 transition"
            >
              Go to login
            </button>
          </>
        )}

        {status === "error" && (
          <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{message}</p>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;