"use client";
import React, { useState } from "react";

export function CreatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isMatch = confirmPassword.length > 0 && confirmPassword === password;
  const isMismatch = confirmPassword.length > 0 && confirmPassword !== password;
  return (
    <form action="/api/dashboard/profile/password" method="post" className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs text-gray-400">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            pattern="(?=.*[A-Za-z])(?=.*\\d).{8,}"
            title="Minimal 8 karakter, mengandung huruf dan angka"
            required
            autoComplete="new-password"
            placeholder="Enter a strong password"
            className="mt-1 w-full h-11 bg-ink-900 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-brand-500 focus:outline-none px-3"
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
            pattern="(?=.*[A-Za-z])(?=.*\\d).{8,}"
            title="Minimal 8 karakter, mengandung huruf dan angka"
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
            className={`mt-1 w-full h-11 bg-ink-900 rounded-xl text-white placeholder-gray-500 focus:outline-none px-3 ${
              isMismatch
                ? "border border-red-500/60 hover:border-red-400 focus:border-red-400"
                : isMatch
                ? "border border-emerald-500/60 hover:border-emerald-400 focus:border-emerald-400"
                : "border border-white/10 hover:border-white/20 focus:border-brand-500"
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="pt-2">
        <button type="submit" className="btn btn-gaming">Create Password</button>
      </div>
    </form>
  );
}
