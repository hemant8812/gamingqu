'use client';
import React, { useState } from "react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isMatch = confirmPassword.length > 0 && confirmPassword === newPassword;
  const isMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;
  return (
    <form action="/api/dashboard/profile/password" method="post" className="space-y-4">
      <input type="hidden" name="mode" value="change" />
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="currentPassword" className="text-xs text-gray-400">Current Password</label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Enter your current password"
            className="mt-1 w-full h-11 bg-[#0A0E17] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none px-3"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="text-xs text-gray-400">New Password</label>
          <input
            id="newPassword"
            name="password"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
            placeholder="Enter a new strong password"
            className="mt-1 w-full h-11 bg-[#0A0E17] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none px-3"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-xs text-gray-400">Confirm New Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
            placeholder="Re-enter your new password"
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
      <div className="pt-2">
        <button type="submit" className="btn btn-gaming">Change Password</button>
      </div>
    </form>
  );
}
