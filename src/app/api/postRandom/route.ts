import { NextRequest } from "next/server";
import { Joke, sequelize } from "@/lib/pg";
import { TwitterApi } from 'twitter-api-v2';
import { headers } from "next/headers";

export async function POST(req: NextRequest) {

    const apiKey = headers().get("x-api-key");

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return new Response("Unauthorized", { status: 401 });
    }

    const client = new TwitterApi({
        appKey: process.env.TWITTER_APP_KEY ?? "",
        appSecret: process.env.TWITTER_APP_SECRET ?? "",
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
    }).readWrite;

    const joke = await Joke.findOne({
        where: {
            approved: true,
            used: false,
        },
        order: sequelize.random(),
    });

    if (!joke) {
        return new Response("No jokes available", { status: 404 });
    }

    try {
        await client.v2.tweet({
        text: joke.get("joke") as string,
       })
    } catch (e) {
        console.log(e);
        return new Response("Failed to post joke", { status: 500 });
    }

    joke.set("used", true);
    await joke.save();

    return new Response("Posted joke", { status: 200 });
}