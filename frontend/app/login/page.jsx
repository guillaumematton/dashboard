'use client';
import Image from 'next/image';
import { useState, useRef, useEffect } from "react";
import "../../css/login.css";
import logo from "../../images/meunier.png"
import Link from 'next/link';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage({ onSubmit } = {}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | error | success
  const [errorMessage, setErrorMessage] = useState("");
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const emailError =
    touched.email && !EMAIL_RE.test(email) ? "Enter a valid email address." : "";
  const passwordError =
    touched.password && password.length === 0 ? "Password is required." : "";

  const canSubmit = EMAIL_RE.test(email) && password.length > 0 && status !== "submitting";

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!EMAIL_RE.test(email) || password.length === 0) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      if (onSubmit) {
        await onSubmit({ email, password, remember });
        setStatus("success");
      } else {
        await fetchLogin();
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err?.message || "Couldn't sign you in. Check your details and try again.");
    }
  }

  function handleGithubLogin() {
    window.location.href = `http://localhost:8080/api/v1/auth/github`;
  }

  async function fetchLogin() {
    fetch("http://localhost:8080/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Login failed");
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        window.location.href = '/';
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(err.message);
        setStatus("error");
      })
  }

  return (
    <div className="mrd-root">
      <aside className="mrd-brief">
        <div>
          <p className="mrd-headline">MeunierBoard</p>
          <svg className="mrd-spark" viewBox="0 0 360 110" aria-hidden="true">
          </svg>
          <Image className="mrd-logo" src={logo} alt="MeunierBoard" />
        </div>
      </aside>

      <main className="mrd-panel">
        <form className="mrd-form-wrap" onSubmit={handleSubmit} noValidate>
          <h1 className="mrd-title">Sign in</h1>

          {status === "error" && (
            <p className="mrd-banner" role="alert">
              {errorMessage}
            </p>
          )}
          {status === "success" && (
            <p className="mrd-banner success" role="status">
              Signed in. Taking you to your dashboard…
            </p>
          )}

          <div className="mrd-field">
            <label className="mrd-label" htmlFor="mrd-email">
              Email
            </label>
            <div className={`mrd-input-row ${emailError ? "has-error" : ""}`}>
              <input
                ref={emailRef}
                id="mrd-email"
                className="mrd-input"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "mrd-email-error" : undefined}
              />
            </div>
            {emailError && (
              <p className="mrd-error-text" id="mrd-email-error">
                {emailError}
              </p>
            )}
          </div>

          <div className="mrd-register-link">
            <p>Don't have an account? <Link href="/register">Register here</Link></p>
          </div>

          <div className="mrd-field">
            <label className="mrd-label" htmlFor="mrd-password">
              Password
            </label>
            <div className={`mrd-input-row ${passwordError ? "has-error" : ""}`}>
              <input
                id="mrd-password"
                className="mrd-input"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "mrd-password-error" : undefined}
              />
              <button
                type="button"
                className="mrd-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {passwordError && (
              <p className="mrd-error-text" id="mrd-password-error">
                {passwordError}
              </p>
            )}
          </div>

          <div className="mrd-row-between">
            <label className="mrd-remember">
              <input
                type="checkbox"
                className="mrd-checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Stay signed in
            </label>
            <button type="button" className="mrd-link">
              Forgot password?
            </button>
          </div>

          <button type="submit" className="mrd-submit" disabled={!canSubmit}>
            {status === "submitting" ? "Signing in…" : "Sign in"}
          </button>

          <div className="mrd-divider"><span>or</span></div>
          
          <button type="button" className="mrd-submit mrd-github" onClick={handleGithubLogin}>
            Continue with GitHub
          </button>
        </form>
      </main>
    </div>
  );
}
