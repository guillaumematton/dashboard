'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Callback() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = params.get("token");
    const err = params.get("error");
    if (err || !token) {
      setError(err || "GitHub sign-in failed.");
      return;
    }
    localStorage.setItem("token", token);
    router.replace("/");
  }, [params, router]);

  return error ? <p role="alert">{error} <a href="/login">Back to sign in</a></p> : <p>Signing you in…</p>;
}

export default function Page() {
  return <Suspense><Callback /></Suspense>;
}