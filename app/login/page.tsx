// app/login/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import type { AuthResponse } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ilham@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        requireAuth: false,
      });

      saveAuth(result.token, result.user);
      router.push("/employees");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Welcome back 👋</div>
          <div className="card-subtitle">
            Sign in to access the AYP employee console.
          </div>
        </div>
        <div className="chips-row">
          <span className="chip">JWT Secured</span>
          <span className="chip">Gen-Z theme</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="stack-md">
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@ayp-group.com"
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.75rem",
            alignItems: "center",
            marginTop: "0.5rem",
          }}
        >
          <small style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
            This is a demo portal. Use your AYP credentials or the seeded test
            user.
          </small>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing you in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
