"use server";
import { Joke, sequelize } from "@/lib/pg";


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

export async function approve(id: string) {
    "use server"
    const joke = await Joke.findByPk(id);
    if (!joke) {
        return null;
    }
    joke.set("approved", true);
    await joke.save();
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