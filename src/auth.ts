import type { NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/prisma";
import { compare } from "bcrypt";
import { z } from "zod";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email dan Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        if (!parsed.success) return null;
        const user = await db.user.findUnique({ where: { email: parsed.data.email } });
        if (!user || !user.password) return null;
        const isValid = await compare(parsed.data.password, user.password);
        if (!isValid) return null;
        const u: User = {
          id: user.id,
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
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id ?? (token.sub as string);
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.AUTH_SECRET,
};
