import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcrypt'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          return null
        }

        const isValidPassword = await compare(credentials.password, user.password)
        if (!isValidPassword) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image ?? undefined,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        // Guarded assignments to satisfy TS without module augmentation
        ;(session.user as any).id = token.id as string | undefined
        session.user.name = token.name ?? session.user.name ?? null
        session.user.email = (token.email as string | undefined) ?? session.user.email ?? null
        session.user.image = (token.picture as string | undefined) ?? session.user.image ?? null
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl + '/auth/signin')) {
        return baseUrl + '/resume'
      }
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: { email: token.email! },
      })
      if (!dbUser) {
        if (user) token.id = (user as any).id
        return token
      }
      return {
        id: dbUser.id,
        name: dbUser.name ?? undefined,
        email: dbUser.email ?? undefined,
        picture: dbUser.image ?? undefined,
      } as any
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/auth/signin' },
}
