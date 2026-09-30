import Link from "next/link";
import type { Metadata } from "next";
import { FiHome, FiSearch } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-ink-900 text-white">
      <div className="text-center max-w-xl">
        <div className="text-7xl md:text-9xl font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-3">Page Not Found</h1>
        <p className="opacity-70 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or no longer exists.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-gaming">
            <FiHome className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <Link href="/blog" className="btn btn-gaming">
            <FiSearch className="h-4 w-4 mr-2" />
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
