'use client';
import { useState, useRef, useEffect } from "react";

/**
 * Meridian — dashboard sign-in screen
 * Split layout: an ink-dark brief on the left, the sign-in form on the right.
 * Palette, type and motion are intentionally scoped to a "control room" feel —
 * calm, precise, legible under pressure.
 */

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
        // Demo behaviour when no onSubmit handler is wired up yet.
        await new Promise((res) => setTimeout(res, 900));
        setStatus("success");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err?.message || "Couldn't sign you in. Check your details and try again.");
    }
  }

  return (
    <div className="mrd-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

        .mrd-root {
          --ink: #14181F;
          --ink-2: #1B212B;
          --ink-line: rgba(247, 245, 240, 0.14);
          --paper: #F7F5F0;
          --paper-line: #E1DACB;
          --brass: #B08D57;
          --brass-dark: #8F7040;
          --slate: #565F6B;
          --slate-light: #8891A0;
          --cream: #F2EFE7;
          --error: #A6412B;

          min-height: 100vh;
          width: 100%;
          display: flex;
          background: var(--paper);
          font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--ink);
        }

        .mrd-brief {
          position: relative;
          flex: 1 1 46%;
          min-height: 100vh;
          background: linear-gradient(165deg, var(--ink) 0%, var(--ink-2) 100%);
          color: var(--cream);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem 3.25rem;
          box-sizing: border-box;
          overflow: hidden;
        }

        .mrd-mark {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        .mrd-mark-dot {
          width: 8px;
          height: 8px;
          background: var(--brass);
          flex: none;
        }

        .mrd-headline {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 400;
          font-size: clamp(1.9rem, 3vw, 2.6rem);
          line-height: 1.22;
          letter-spacing: -0.01em;
          max-width: 15ch;
          margin: 2.5rem 0 2rem;
        }

        .mrd-spark {
          width: 100%;
          max-width: 360px;
        }

        .mrd-footline {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          border-top: 1px solid var(--ink-line);
          padding-top: 1rem;
          font-size: 0.8rem;
          color: var(--slate-light);
        }

        .mrd-footline .num {
          font-variant-numeric: tabular-nums;
          color: var(--cream);
        }

        .mrd-panel {
          flex: 1 1 54%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          box-sizing: border-box;
        }

        .mrd-form-wrap {
          width: 100%;
          max-width: 360px;
        }

        .mrd-eyebrow {
          font-size: 0.8rem;
          color: var(--slate);
          margin: 0 0 0.4rem;
        }

        .mrd-title {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 400;
          font-size: 2rem;
          letter-spacing: -0.01em;
          margin: 0 0 1.75rem;
        }

        .mrd-field {
          margin-bottom: 1.25rem;
        }

        .mrd-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--ink);
          margin-bottom: 0.4rem;
        }

        .mrd-input-row {
          position: relative;
          display: flex;
          align-items: center;
          border: 1px solid var(--paper-line);
          background: #fff;
          transition: border-color 0.15s ease;
        }

        .mrd-input-row:focus-within {
          border-color: var(--brass);
        }

        .mrd-input-row.has-error {
          border-color: var(--error);
        }

        .mrd-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          padding: 0.7rem 0.85rem;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.95rem;
          color: var(--ink);
        }

        .mrd-input::placeholder {
          color: var(--slate-light);
        }

        .mrd-toggle {
          background: none;
          border: none;
          padding: 0 0.85rem;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--slate);
          cursor: pointer;
          white-space: nowrap;
        }

        .mrd-toggle:hover {
          color: var(--ink);
        }

        .mrd-toggle:focus-visible,
        .mrd-input:focus-visible {
          outline: 2px solid var(--brass);
          outline-offset: 2px;
        }

        .mrd-error-text {
          margin: 0.4rem 0 0;
          font-size: 0.8rem;
          color: var(--error);
        }

        .mrd-row-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0.25rem 0 1.75rem;
          font-size: 0.85rem;
        }

        .mrd-remember {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--slate);
          cursor: pointer;
        }

        .mrd-checkbox {
          width: 15px;
          height: 15px;
          accent-color: var(--brass);
          cursor: pointer;
        }

        .mrd-link {
          color: var(--slate);
          text-decoration: underline;
          text-underline-offset: 2px;
          background: none;
          border: none;
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
        }

        .mrd-link:hover {
          color: var(--ink);
        }

        .mrd-submit {
          width: 100%;
          padding: 0.8rem 1rem;
          background: var(--brass);
          color: var(--ink);
          border: none;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease, opacity 0.15s ease;
        }

        .mrd-submit:hover:not(:disabled) {
          background: var(--brass-dark);
        }

        .mrd-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mrd-submit:focus-visible {
          outline: 2px solid var(--ink);
          outline-offset: 2px;
        }

        .mrd-banner {
          margin: 0 0 1.25rem;
          padding: 0.7rem 0.85rem;
          font-size: 0.85rem;
          border-left: 2px solid var(--error);
          background: #FBF1EE;
          color: var(--error);
        }

        .mrd-banner.success {
          border-left-color: #3E6B4C;
          background: #EEF4EF;
          color: #2C5138;
        }

        .mrd-footer-text {
          margin-top: 1.75rem;
          font-size: 0.85rem;
          color: var(--slate);
        }

        @media (max-width: 860px) {
          .mrd-root {
            flex-direction: column;
          }
          .mrd-brief {
            min-height: auto;
            padding: 2rem 1.75rem;
          }
          .mrd-headline {
            font-size: 1.6rem;
            margin: 1.5rem 0;
          }
          .mrd-spark {
            max-width: 260px;
          }
          .mrd-panel {
            padding: 2rem 1.75rem 3rem;
          }
        }
      `}</style>

      <aside className="mrd-brief">
        <div>
          <p className="mrd-headline">MeunierBoard</p>
          <svg className="mrd-spark" viewBox="0 0 360 110" aria-hidden="true">
          </svg>
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
        </form>
      </main>
    </div>
  );
}
