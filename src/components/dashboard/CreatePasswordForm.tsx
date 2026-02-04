"use client";
import React, { useMemo, useState } from "react";

function strengthOf(pw: string): "weak" | "moderate" | "strong" {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[a-z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  if (score <= 2) return "weak";
  if (score <= 4) return "moderate";
  return "strong";
}

export function CreatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const level = useMemo(() => strengthOf(password), [password]);
  const isMatch = confirmPassword.length > 0 && confirmPassword === password;
  const isMismatch = confirmPassword.length > 0 && confirmPassword !== password;
  const circleCls =
    level === "strong"
      ? "border-emerald-500/60 text-emerald-300 bg-emerald-500/5"
      : level === "moderate"
      ? "border-yellow-500/60 text-yellow-300 bg-yellow-500/5"
      : "border-red-500/60 text-red-300 bg-red-500/5";
  const label = level === "strong" ? "Strong" : level === "moderate" ? "Moderate" : "Weak";
  return (
    <form action="/api/dashboard/profile/password" method="post" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs text-gray-400">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
              placeholder="Enter a strong password"
              className="mt-1 w-full h-11 bg-[#0A0E17] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none px-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs text-gray-400">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className={`mt-1 w-full h-11 bg-[#0A0E17] rounded-xl text-white placeholder-gray-500 focus:outline-none px-3 ${
                isMismatch
                  ? "border border-red-500/60 hover:border-red-400 focus:border-red-400"
                  : isMatch
                  ? "border border-emerald-500/60 hover:border-emerald-400 focus:border-emerald-400"
                  : "border border-white/10 hover:border-white/20 focus:border-blue-500"
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className={`rounded-full ${circleCls} border-4 flex items-center justify-center mx-auto w-36 h-36 md:w-40 md:h-40`}>
          <span className="text-sm font-semibold">{label}</span>
        </div>
      </div>
      <div className="pt-2">
        <button type="submit" className="btn btn-gaming">Create Password</button>
      </div>
    </form>
  );
}
