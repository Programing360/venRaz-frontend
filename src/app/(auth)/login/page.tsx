"use client";

// change auth client 

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthFormShell from "@/components/auth/auth-form-shell";
import { ErrorBanner, Field, PrimaryButton, TextInput } from "@/components/auth/fields";
import { authClient } from "@/lib/auth-client";



export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        setError(error.message || "Invalid email or password. Please try again.");
        return;
      }

      if (data) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormShell
      eyebrow="Welcome back"
      headline="Pick up right where the last deal left off."
      body="Your pipeline, notes, and contacts are exactly where you left them."
      title="Sign in"
      subtitle="Enter your credentials to continue."
      footer={
        <p className="text-sm text-[#6B7268]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#0E1B1B] hover:text-[#C08A3E]">
            Create an account
          </Link>
        </p>
      }
    >
      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Field label="Email address" htmlFor="email" />
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e:any) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <Field
            label="Password"
            htmlFor="password"
            rightSlot={
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#0E1B1B] hover:text-[#C08A3E]"
              >
                Forgot password?
              </Link>
            }
          />
          <TextInput
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e:any) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-[#DEDACE] text-[#0E1B1B] focus:ring-[#C08A3E]"
          />
          <span className="text-sm text-[#4B4F49]">Remember me</span>
        </label>

        <PrimaryButton type="submit" loading={loading} loadingText="Signing in…">
          Sign in
        </PrimaryButton>
      </form>
    </AuthFormShell>
  );
}