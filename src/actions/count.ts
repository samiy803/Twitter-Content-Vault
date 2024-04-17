"use server";

import { Joke } from "@/lib/pg";

export default async function count(status: string) {
    let where = {};

    if (status) {
        switch (status) {
            case "approved":
                where = { approved: true };
                break;
            case "discarded":
                where = { discarded: true };
                break;
            case "used":
                where = { used: true };
                break;
            case "none":
                where = { used: false, discarded: false, approved: false };
                break;
        }
    }

    const count = await Joke.count({
        where,
    });

    return count;
}
