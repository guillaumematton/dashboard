'use client';
import Image from 'next/image';
import { useState, useRef, useEffect } from "react";
import "../../css/register.css";
import logo from "../../images/meunier.png"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register({ onSubmit } = {}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
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
        // Demo behaviour when no onSubmit handler is wired up yet.
        await new Promise((res) => setTimeout(res, 900));
        setStatus("success");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err?.message || "Couldn't register you in. Check your details and try again.");
    }
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
          <h1 className="mrd-title">Register</h1>

          {status === "error" && (
            <p className="mrd-banner" role="alert">
              {errorMessage}
            </p>
          )}
          {status === "success" && (
            <p className="mrd-banner success" role="status">
              Registration successful. Taking you to your dashboard…
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

          <div className="mrd-field">
            <label className="mrd-label" htmlFor="mrd-confirm-password">
              Confirm Password
            </label>
            <div className={`mrd-input-row ${passwordError ? "has-error" : ""}`}>
              <input
                id="mrd-confirm-password"
                className="mrd-input"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "mrd-confirm-password-error" : undefined}
              />
            </div>
            {passwordError && (
              <p className="mrd-error-text" id="mrd-confirm-password-error">
                {passwordError}
              </p>
            )}
          </div>
          <button type="submit" className="mrd-submit" disabled={!canSubmit}>
            {status === "submitting" ? "Registering…" : "Register"}
          </button>
        </form>
      </main>
    </div>
  );
}
