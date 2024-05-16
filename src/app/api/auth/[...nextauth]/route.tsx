import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { prisma } from "@/lib/Prisma";
import { createHash } from 'crypto';

const salt = process.env.SALT;

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Availabowl",
            id: "username-login",
            credentials: {
                userValue: {},
                password: {}
            },
            async authorize(credentials, req) {
                const result = await prisma.users.findUnique({
                    where: {
                        username: credentials?.userValue,
                        password: createHash('sha256').update(credentials?.password!+salt).digest('hex'),
                        status: 3
                    },
                    select: {
                        email: true,
                        imageurl: true,
                        id: true,
                        username: true
                    }
                });
                return result;
            }
        })
    ],
    pages: {
        signIn: '/'
    },
    session: { strategy: "jwt"},
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({token, account, profile, trigger, user}): Promise<JWT> {
            if (account?.provider === 'username-login') {
                const data = user as any;
                token.email = data.email;
                token.picture = data.imageurl;
                token.name = data.username;
            }
            return token;
        }
    }
});

export { handler as GET, handler as POST };