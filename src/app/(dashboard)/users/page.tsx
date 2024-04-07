"use server";

import { sequelize, User } from "@/lib/pg";
import Users from "@/components/Users";

export default async function UsersPage() {
    const users = (await User.findAll()).map((user) => user.toJSON()) as any[];

    // Set up like this on purpose to fetch data server-side and hydrate client-side
    return <Users users={users} />;
}
