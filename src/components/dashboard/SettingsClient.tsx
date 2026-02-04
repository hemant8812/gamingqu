"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ToggleProps = { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void };

function Toggle({ label, desc, value, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0E17] border border-white/10">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        {desc ? <div className="text-xs text-gray-400">{desc}</div> : null}
      </div>
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={value} onChange={(e) => onChange(e.target.checked)} />
        <div className="w-11 h-6 bg-white/10 peer-checked:bg-blue-600 rounded-full peer-focus:ring-2 ring-blue-500 transition-colors relative">
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : ""}`} />
        </div>
      </label>
    </div>
  );
}

export function SettingsClient() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      if (typeof window === "undefined") return "dark";
      const t = window.localStorage.getItem("pref_theme");
      return t === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });
  const [emailNotif, setEmailNotif] = useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return true;
      const e = window.localStorage.getItem("pref_notifications_email");
      return e === "false" ? false : true;
    } catch {
      return true;
    }
  });
  const [pushNotif, setPushNotif] = useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return false;
      const p = window.localStorage.getItem("pref_notifications_push");
      return p === "true" ? true : false;
    } catch {
      return false;
    }
  });
  const [profileVisible, setProfileVisible] = useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return true;
      const v = window.localStorage.getItem("pref_privacy_profileVisible");
      return v === "false" ? false : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("pref_theme", theme);
      localStorage.setItem("pref_notifications_email", String(emailNotif));
      localStorage.setItem("pref_notifications_push", String(pushNotif));
      localStorage.setItem("pref_privacy_profileVisible", String(profileVisible));
    } catch {}
  }, [theme, emailNotif, pushNotif, profileVisible]);

  const themeLabel = useMemo(() => (theme === "dark" ? "Dark" : "Light"), [theme]);

  return (
    <div className="card-gaming rounded-2xl p-5 hover:translate-y-0">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-white">Appearance</div>
          <div className="text-xs text-gray-400">Customize how the dashboard looks</div>
        </div>
        <div className="rounded-xl bg-white/10 text-white text-xs px-3 py-1">{themeLabel}</div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0A0E17] border border-white/10">
          <div className="flex-1">
            <div className="text-sm font-medium text-white">Theme</div>
            <div className="text-xs text-gray-400">Switch between Dark and Light</div>
          </div>
          <div className="inline-flex gap-2">
            <button
              type="button"
              className={theme === "dark" ? "h-9 px-4 rounded-xl bg-white/10 text-white border border-white/10" : "h-9 px-4 rounded-xl bg-white/5 text-gray-300 border border-white/10"}
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
            <button
              type="button"
              className={theme === "light" ? "h-9 px-4 rounded-xl bg-white/10 text-white border border-white/10" : "h-9 px-4 rounded-xl bg-white/5 text-gray-300 border border-white/10"}
              onClick={() => setTheme("light")}
            >
              Light
            </button>
          </div>
        </div>
      </div>

      <div className="my-6 h-px bg-white/10" />

      <div>
        <div className="text-lg font-bold text-white">Notifications</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Toggle label="Email Notifications" desc="Receive updates via email" value={emailNotif} onChange={setEmailNotif} />
          <Toggle label="Push Notifications" desc="Show alerts in the dashboard" value={pushNotif} onChange={setPushNotif} />
        </div>
      </div>

      <div className="my-6 h-px bg-white/10" />

      <div>
        <div className="text-lg font-bold text-white">Privacy</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Toggle label="Profile Visibility" desc="Allow others to view your profile" value={profileVisible} onChange={setProfileVisible} />
        </div>
      </div>

      <div className="my-6 h-px bg-white/10" />

      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-white">Security</div>
          <div className="text-xs text-gray-400">Manage your account protection</div>
        </div>
        <Link href="/dashboard/profile" className="btn btn-gaming btn-sm">Manage Password</Link>
      </div>
    </div>
  );
}
