import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const csp = [
  `default-src 'self'`,
  `base-uri 'self'`,
  `frame-ancestors 'none'`,
  `form-action 'self'`,
  `img-src 'self' data: blob: https:`,
  `style-src 'self' 'unsafe-inline'`,
  `font-src 'self' data:`,
  `connect-src 'self' https:${isDev ? " http: ws:" : ""}`,
  `script-src 'self'${isDev ? " 'unsafe-eval' 'unsafe-inline'" : ""}`,
].join("; ");

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [100, 75],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
