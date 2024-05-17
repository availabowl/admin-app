import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { prisma } from "@/lib/Prisma";
import { createHash } from 'crypto';
import bcrypt from 'bcrypt';
import { AuthUser } from "@/types/db_interfaces";

const salt = process.env.SALT;
const saltRounds = Number(process.env.SALT_ROUNDS!);

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
                const sha256_password = createHash('sha256').update(credentials?.password!+salt).digest('hex');
                const bcrypt_password = await bcrypt.hash(credentials?.password!, saltRounds);
                const results = await prisma.$queryRaw`
                SELECT 
                    email,
                    CASE
                        WHEN LENGTH(imageurl) = 0 THEN CONCAT('https://ui-avatars.com/api/?name=', SUBSTRING(name, 0, 2), '&background=333&color=FFF')
                        WHEN LENGTH(imageurl) > 0 THEN CONCAT(${process.env.NEXT_PUBLIC_S3_URL}, imageurl)
                    ELSE NULL END AS "imageurl",
                    id,
                    username,
                    bcrypt_password IS NOT NULL as uses_bcrypt,
                    bcrypt_password
                from users 
                    WHERE username = ${credentials?.userValue} AND status = 3 AND (password = ${sha256_password} OR (password = '' AND bcrypt_password IS NOT NULL)) LIMIT 1;
                ` as Array<AuthUser>;

                if (results.length > 0) {
                    // Check if bcrypt_password is not in use
                    if (results[0].uses_bcrypt === false) {
                        await prisma.users.update({
                            where: {
                                id: results[0].id
                            },
                            data: {
                                bcrypt_password,
                                password: '' // Eliminate SHA256 password hashes from system
                            }
                        });
                        return results[0];
                    }
                    const bcrypt_password_is_valid = await bcrypt.compare(credentials?.password!, results[0].bcrypt_password);
                    if (bcrypt_password_is_valid) return results[0];
                }
                return null;
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