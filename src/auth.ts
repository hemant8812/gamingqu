import type { NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/prisma";
import { compare } from "bcrypt";
import { z } from "zod";
import { normalizeEmail } from "@/lib/sanitize";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 10;
 
const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) {
  throw new Error("AUTH_SECRET is required in environment");
}
const SESSION_MAX_AGE_ENV = Number(process.env.SESSION_MAX_AGE ?? "");
const SESSION_MAX_AGE = Number.isFinite(SESSION_MAX_AGE_ENV) && SESSION_MAX_AGE_ENV > 0 ? SESSION_MAX_AGE_ENV : 60 * 60 * 24 * 7;

declare global {
  var __loginAttemptMap__: Map<string, { windowStart: number; count: number }> | undefined;
}


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE },
  providers: [
    Credentials({
      name: "Email dan Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6).max(128) })
          .safeParse(credentials);
        if (!parsed.success) return null;
        const email = normalizeEmail(parsed.data.email);
        const password = parsed.data.password.trim();
        globalThis.__loginAttemptMap__ ??= new Map();
        const rec = globalThis.__loginAttemptMap__.get(email);
        const now = Date.now();
        if (rec && now - rec.windowStart <= LOGIN_WINDOW_MS && rec.count >= LOGIN_MAX_ATTEMPTS) {
          return null;
        }
        const user = await db.user.findUnique({
          where: { email },
          select: { id: true, username: true, name: true, email: true, image: true, role: true, password: true, isSuspended: true },
        });
        if (!user || !user.password || user.isSuspended) {
          const prev = rec && now - rec.windowStart <= LOGIN_WINDOW_MS ? rec : { windowStart: now, count: 0 };
          globalThis.__loginAttemptMap__.set(email, { windowStart: prev.windowStart, count: prev.count + 1 });
          return null;
        }
        const isValid = await compare(password, user.password);
        if (!isValid) {
          const prev = rec && now - rec.windowStart <= LOGIN_WINDOW_MS ? rec : { windowStart: now, count: 0 };
          globalThis.__loginAttemptMap__.set(email, { windowStart: prev.windowStart, count: prev.count + 1 });
          return null;
        }
        globalThis.__loginAttemptMap__.set(email, { windowStart: now, count: 0 });
        const u: User = {
          id: user.id,
          username: user.username ?? undefined,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          image: user.image ?? undefined,
          role: user.role,
        };
        return u;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        const u = user as User & { username?: string | null; id: string };
        token.id = u.id;
        token.username = u.username ?? null;
        (token as Record<string, unknown>).suspended = false;
      } else if (token.id) {
        try {
          const u = await db.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, username: true, isSuspended: true },
          });
          if (u) {
            token.username = u.username ?? null;
            (token as Record<string, unknown>).role = u.role;
            (token as Record<string, unknown>).suspended = !!u.isSuspended;
          }
        } catch {}
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id ?? (token.sub as string);
        session.user.username = token.username ?? null;
        const roleVal = (token as Record<string, unknown>).role as "MEMBER" | "BOOSTER" | "ADMIN" | "SUPERADMIN" | undefined;
        if (roleVal) {
          session.user.role = roleVal;
        }
        const suspendedVal = (token as Record<string, unknown>).suspended as boolean | undefined;
        if (typeof suspendedVal === "boolean") {
          (session.user as Record<string, unknown>).isSuspended = suspendedVal;
        }
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: AUTH_SECRET,
};
