"use server";

import { headers } from "next/headers";
import { User } from "@/lib/pg";
import argon2 from "argon2";

export async function newUser(formdata: FormData) {
    const h = headers();
    const isAdmin = h.get("x-is-admin");
    if (isAdmin !== "true") {
        throw new Error("You must be an admin to create a user.");
    }

    const username = formdata.get("username") as string;
    const password = formdata.get("password") as string;
    const admin = formdata.get("admin") as string;

    if (!username || !password) {
        throw new Error("Username and password are required.");
    }

    if (admin !== "true" && admin !== "false") {
        throw new Error("Admin must be true or false.");
    }

    const existing = await User.findOne({ where: { username } });

    if (existing) {
        throw new Error("Username already exists.");
    }

    const passwordHash = await argon2.hash(password);

    const user = await User.create({ username, password: passwordHash, admin });
    return {...user.dataValues, password: undefined};
}