"use server";
import { db } from "@/lib/cozo";
import { Joke, sequelize } from "@/lib/pg";
import { exec } from "child_process";


export async function getNextJoke() {
    "use server"
    const joke = await Joke.findOne({
        where: {
            approved: false,
            discarded: false,
            hold: false,
        },
        order: sequelize.random(),
    })
    return joke?.toJSON();
}

export async function approve(id: string, updatedJoke: string) {
    "use server"
    const joke = await Joke.findByPk(id);
    if (!joke) {
        return null;
    }
    joke.set("joke", updatedJoke);
    joke.set("approved", true);
    await joke.save();
    const ex = exec("python src/app/api/similarMatch/embed.py", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        let i = 0;
        const put = () => {
            db.run(`?[k, v] <- [[\"${id}\", ${stdout.trim()}]] \n :put jokes {k => v}`).catch(async (err) => {
                // database is probably locked. retry after 500ms second
                await new Promise((resolve) => setTimeout(resolve, 500));
                put();
                // don't want to exceed recursion limit, so we'll just retry 15 times
                if (i++ > 15) {
                    console.error("Failed to update database after 15 retries.");
                    console.error(err);
                }
            });
        }
        put();
    })

    ex.stdin?.write("search_document: " + updatedJoke);
    ex.stdin?.end();
}

export async function discard(id: string) {
    "use server"
    const joke = await Joke.findByPk(id);
    if (!joke) {
        return null;
    }
    joke.set("discarded", true);
    await joke.save();
}

export async function hold(id: string) {
    "use server"
    const joke = await Joke.findByPk(id);
    if (!joke) {
        return null;
    }
    joke.set("hold", true);
    await joke.save();
}