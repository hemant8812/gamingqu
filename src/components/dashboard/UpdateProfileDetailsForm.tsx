'use client';
import React, { useMemo, useState } from "react";

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function UpdateProfileDetailsForm({ initialName, initialEmail }: { initialName: string; initialEmail: string }) {
  const [name, setName] = useState(initialName ?? "");
  const [email, setEmail] = useState(initialEmail ?? "");
  const emailValid = useMemo(() => isValidEmail(email), [email]);
  const nameValid = useMemo(() => name.trim().length >= 2, [name]);
  const emailCls =
    email.length === 0
      ? "border border-white/10 hover:border-white/20 focus:border-blue-500"
      : emailValid
      ? "border border-emerald-500/60 hover:border-emerald-400 focus:border-emerald-400"
      : "border border-red-500/60 hover:border-red-400 focus:border-red-400";
  const nameCls =
    name.length === 0
      ? "border border-white/10 hover:border-white/20 focus:border-blue-500"
      : nameValid
      ? "border border-emerald-500/60 hover:border-emerald-400 focus:border-emerald-400"
      : "border border-red-500/60 hover:border-red-400 focus:border-red-400";
  return (
    <form action="/api/dashboard/profile/details" method="post" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs text-gray-400">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            placeholder="Enter your full name"
            className={`mt-1 w-full h-11 bg-[#0A0E17] rounded-xl text-white placeholder-gray-500 focus:outline-none px-3 ${nameCls}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs text-gray-400">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email address"
            className={`mt-1 w-full h-11 bg-[#0A0E17] rounded-xl text-white placeholder-gray-500 focus:outline-none px-3 ${emailCls}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="pt-2">
        <button type="submit" className="btn btn-gaming">Save Changes</button>
      </div>
    </form>
  );
}
