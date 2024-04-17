"use server";

import { User } from "@/lib/pg";
import Users from "@/components/Users";
import { headers } from "next/headers";


export default async function UsersPage() {
    const users = (await User.findAll()).map((user) => user.toJSON()) as any[];
    const isAdmin = headers().get("x-is-admin") === "true";

    // Set up like this on purpose to fetch data server-side and hydrate client-side
    return <Users users={users} admin={isAdmin} />;
}
