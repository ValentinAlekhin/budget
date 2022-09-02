import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { axios } from '../../../axios'


export default NextAuth({
  providers: [
    Credentials({
      name: 'Creadetials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post('/auth/login', credentials)
          return data
        } catch (e) {
          return null
        }
      },
    }),
    ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ user, token }) {
      if (user?.access_token) token.access_token = user.access_token

      return token
    },
    async session({ session, token }) {
      return { ...session, ...token }
    },
  },
  pages: {
    signIn: '/login',
  },
})