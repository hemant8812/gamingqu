import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "MEMBER" | "BOOSTER" | "ADMIN" | "SUPERADMIN";
    };
  }

  interface User {
    id: string;
    role: "MEMBER" | "BOOSTER" | "ADMIN" | "SUPERADMIN";
    name?: string | null;
    email?: string | null;
    image?: string | null;
    password?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "MEMBER" | "BOOSTER" | "ADMIN" | "SUPERADMIN";
  }
}

