import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getEmbeds } from "@/lib/embeds";
import { headers } from "next/headers";
import { EmbedInjector } from "@/components/EmbedInjector";
import { getSiteMeta } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A0E17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const { base, siteName, tagline, logo, favicon } = await getSiteMeta();

  return {
    metadataBase: new URL(base),
    title: {
      default: `${siteName} - ${tagline}`,
      template: `%s | ${siteName}`,
    },
    description: tagline,
    applicationName: siteName,
    referrer: "origin-when-cross-origin",
    authors: [{ name: siteName, url: base }],
    creator: siteName,
    publisher: siteName,
    formatDetection: { email: false, address: false, telephone: false },
    alternates: { canonical: "/" },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: base,
      siteName,
      title: `${siteName} - ${tagline}`,
      description: tagline,
      images: [{ url: logo, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} - ${tagline}`,
      description: tagline,
      images: [logo],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", type: "image/x-icon" },
        { url: favicon },
      ],
      shortcut: ["/favicon.ico"],
      apple: [favicon],
    },
    manifest: "/manifest.webmanifest",
    category: "gaming",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, meta, embeds, hdrs] = await Promise.all([
    getServerSession(authOptions).catch(() => null),
    getSiteMeta(),
    getEmbeds(),
    headers(),
  ]);
  const nonce = hdrs.get("x-nonce") || "";
  const { base, siteName, logo, favicon, logoUrl, contactEmail, contactPhone, eurPerUsd } = meta;

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: siteName,
    url: base,
    inLanguage: "en",
  };

  const orgLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: siteName,
    url: base,
    logo: { "@type": "ImageObject", url: logo },
  };
  if (contactEmail || contactPhone) {
    orgLd.contactPoint = [{
      "@type": "ContactPoint",
      contactType: "customer support",
      ...(contactEmail ? { email: contactEmail } : {}),
      ...(contactPhone ? { telephone: contactPhone } : {}),
      availableLanguage: ["English"],
    }];
  }

  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href={favicon} />
        <meta name="theme-color" content="#0A0E17" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 1. Intercept global error events during capture phase to prevent overlays
                window.addEventListener('error', function(event) {
                  try {
                    var filename = event.filename || '';
                    var error = event.error;
                    var message = event.message || '';
                    if (
                      filename.indexOf('tawk.to') !== -1 || 
                      filename.indexOf('tawk') !== -1 ||
                      message === 'true' ||
                      message === true ||
                      (error && (error.message === 'true' || error.message === true || (error.stack && (error.stack.indexOf('tawk') !== -1))))
                    ) {
                      event.stopImmediatePropagation();
                      event.preventDefault();
                    }
                  } catch(e) {}
                }, true);

                window.addEventListener('unhandledrejection', function(event) {
                  try {
                    var reason = event.reason;
                    if (reason) {
                      var stack = reason.stack || '';
                      var message = reason.message || '';
                      if (
                        stack.indexOf('tawk.to') !== -1 || 
                        stack.indexOf('tawk') !== -1 ||
                        message === 'true' ||
                        message === true
                      ) {
                        event.stopImmediatePropagation();
                        event.preventDefault();
                      }
                    }
                  } catch(e) {}
                }, true);

                // 2. Wrap console.error and defineProperty to filter tawk errors
                function wrap(fn) {
                  if (typeof fn !== 'function') return fn;
                  if (fn.__wrapped) return fn;
                  var wrapped = function() {
                    try {
                      var stack = new Error().stack || '';
                      if (stack.indexOf('tawk.to') !== -1 || stack.indexOf('tawk') !== -1) {
                        return;
                      }
                    } catch (e) {}

                    for (var i = 0; i < arguments.length; i++) {
                      var arg = arguments[i];
                      if (arg === true || arg === 'true') {
                        return;
                      }
                      if (arg && typeof arg === 'object') {
                        try {
                          if (arg.message === 'true' || arg.message === true) {
                            return;
                          }
                          if (arg.stack && (arg.stack.indexOf('tawk.to') !== -1 || arg.stack.indexOf('tawk') !== -1)) {
                            return;
                          }
                        } catch (e) {}
                      }
                      if (typeof arg === 'string' && (arg.indexOf('tawk.to') !== -1 || arg.indexOf('tawk') !== -1)) {
                        return;
                      }
                    }
                    return fn.apply(console, arguments);
                  };
                  wrapped.__wrapped = true;
                  return wrapped;
                }

                var currentError = wrap(console.error);
                Object.defineProperty(console, 'error', {
                  get: function() { return currentError; },
                  set: function(val) {
                    currentError = wrap(val);
                  },
                  configurable: true,
                  enumerable: true
                });

                var origDefineProperty = Object.defineProperty;
                Object.defineProperty = function(obj, prop, descriptor) {
                  if (obj === console && prop === 'error') {
                    if (descriptor.value) {
                      descriptor.value = wrap(descriptor.value);
                    } else if (descriptor.get) {
                      var origGet = descriptor.get;
                      descriptor.get = function() {
                        return wrap(origGet());
                      };
                    }
                  }
                  return origDefineProperty.apply(this, arguments);
                };
              })();
            `
          }}
        />
        <JsonLd data={[websiteLd, orgLd]} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <EmbedInjector embeds={embeds} nonce={nonce} />
        <Providers eurPerUsd={eurPerUsd}>
          <Navbar siteName={siteName} logoUrl={logoUrl} user={session?.user ?? null} />
          <main className="pt-16">{children}</main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
