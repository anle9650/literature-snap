import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from "next-auth/providers/google";

import User from "@/models/user";
import { connectToDB } from "@/utils/database";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        }),
    ],
    callbacks: {
        async session({ session }) {
            const sessionUser = await User.findOne({
                email: session.user?.email,
            });

            return {
                ...session,
                user: {
                    ...session.user,
                    id: sessionUser._id.toString()
                }
            }
        },
        async signIn({ profile }) {
            try {
                await connectToDB();

                const userExists = await User.findOne({
                    email: profile?.email,
                });

                if (!userExists) {
                    await User.create({
                        email: profile?.email,
                        username: profile?.name?.replace(" ", "").toLowerCase(),
                        image: profile?.picture,
                    });
                }

                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
    },
}

export default NextAuth(authOptions);