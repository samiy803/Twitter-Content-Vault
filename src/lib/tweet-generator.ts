"use client";

import { toPng } from "html-to-image";

export type TweetData = {
    image: string;
    body: string;
    username: string;
    likes: string;
    reposts: string;
    views: string;
    date: string;
    time: string;
    bookmarks: string;
    displayName: string;
    quotes: string;
};

export default function generateTweet(data: TweetData) {
    return new Promise<string>((resolve) => {
        if (typeof window === "undefined") return null;
        fetch("/tweet.template").then(async (res) => {
            let html = await res.text();
            html = html.replaceAll("{replace_data_image}", data.image);
            html = html.replaceAll("{replace_body}", data.body);
            html = html.replaceAll("{replace_username}", data.username);
            html = html.replaceAll("{replace_likes}", data.likes);
            html = html.replaceAll("{replace_reposts}", data.reposts);
            html = html.replaceAll("{replace_views}", data.views);
            html = html.replaceAll("{replace_date}", data.date);
            html = html.replaceAll("{replace_time}", data.time);
            html = html.replaceAll("{replace_bookmarks}", data.bookmarks);
            html = html.replaceAll("{replace_display_name}", data.displayName);
            html = html.replaceAll("{replace_quotes}", data.quotes);

            const tweet = document.createElement("iframe");
            tweet.srcdoc = html;
            tweet.style.position = "absolute";
            tweet.style.top = "-9999px";
            tweet.style.left = "-9999px";
            tweet.style.width = "6000px";
            tweet.style.height = "auto";
            document.body.appendChild(tweet);

            tweet.onload = async () => {
                console.log("loaded");
                const t = tweet.contentWindow?.document.querySelector(
                    ".r-1igl3o0"
                ) as HTMLElement;
                const image = await toPng(t);
                resolve(image);
            };
        });
    });
}
