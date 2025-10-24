import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getDbAsync } from "./lib/db"

const prisma = await getDbAsync()
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [],
})