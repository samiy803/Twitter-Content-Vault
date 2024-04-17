"use server";

import { headers } from "next/headers";
import { User } from "@/lib/pg";

export async function deleteUser(id: string) {
    "use server"
    const h = headers();
    const isAdmin = h.get("x-is-admin");
    const requestingUserId = h.get("x-user-id");
    console.log({isAdmin, requestingUserId, id})
    if (requestingUserId == id) {
        throw new Error("You cannot delete yourself.");
    }
    if (isAdmin !== "true") {
        throw new Error("You must be an admin to delete a user.");
    }
    await User.destroy({ where: { id } });
}
