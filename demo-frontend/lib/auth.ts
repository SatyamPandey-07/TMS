import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { connectDb } from "./dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions= {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password")
                }

                try {
                    
                   console.log("🔗 Connecting to MongoDB...");
                    await connectDb();
                    console.log("✅ DB connected");
                   const user = await User.findOne({email: credentials.email})

                   if(!user) {
                     throw new Error("User is not registered")
                   }

                   const isValid = await bcrypt.compare(credentials.password, user.password)

                   if(!isValid) {
                    throw new Error("Invalid Password")
                   }

                   return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                    name: user.name
                   }

                } catch (error) {
                    console.log(error)
                    throw error
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if(user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role;
                token.name = user.name;
            }

            return token
        },
        async session({session, token}){
            
            if(session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
                session.user.name = token.name as string;
            }
            
            
            return session
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 *60 *60
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/login"
    }
}