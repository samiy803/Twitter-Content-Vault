"use server";

import { sequelize, User } from "@/lib/pg";
import { Op } from "sequelize";
import argon2 from "argon2";
import { cookies } from "next/headers";
import * as jose from "jose";

export default async function signIn(username: string, password: string) {
    const user = await User.findOne({
        where: {
            username: {
                [Op.eq]: username,
            },
        },
    });

    if (!user) {
        throw new Error("Incorrect username or password");
    }

    const correct_hash = user.get("password") as string;

    try {
        if (await argon2.verify(correct_hash, password)) {

            const token = await new jose.SignJWT({
                username: user.get("username"),
                admin: user.get("admin"),
                id: user.get("id"),
            })
                .setProtectedHeader({ alg: "HS256" })
                .setAudience("jokevault")
                .setIssuer("jokevault")
                .setExpirationTime("1h")
                .sign(new TextEncoder().encode(process.env.JWT_SECRET ?? ""));

            cookies().set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
            });
        } else {
            throw new Error("Incorrect username or password");
        }
    } catch (err) {
        console.error(err);
        throw new Error("Incorrect username or password");
    }
}
