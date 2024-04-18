"use client";
import TweetPreview from "@/components/tweet-preview";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { approve, discard, getNextJoke, hold } from "@/actions/jokes";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function Workarea() {
    const [joke, setJoke] = useState({} as any);
    const [tweet, setTweet] = useState("");
    const [debouncedTweet] = useDebounce(tweet, 250);

    useEffect(() => {
        getNextJoke().then((joke) => {
            setTweet(joke?.joke || "");
            setJoke(joke);
        });
    }, []);

    return (
        <div className="flex flex-row flex-wrap items-start justify-between mt-4">
            <div className="flex-grow">
                <h2 className="text-xl font-bold mt-8">Edit Tweet</h2>
                <div className="pt-4 ps-0 pe-6">
                    <Textarea
                        className="w-full h-64 p-4 rounded-lg"
                        onChange={(e) => setTweet(e.target.value)}
                        value={tweet}
                        placeholder="Type your tweet here"
                    />
                    <p
                        className={`text-sm text-muted-foreground text-right ${
                            tweet.length > 280 ? "text-red-600" : ""
                        }`}
                    >
                        {tweet.length} / 280 characters
                    </p>
                </div>
                <div className="flex flex-row justify-between ps-0 pe-6">
                    <div className="flex flex-row space-x-4">
                        <Button
                            className="mt-4"
                            variant="destructive"
                            onClick={() => {
                                discard(joke.id);
                                getNextJoke().then((joke) => {
                                    setTweet(joke?.joke || "");
                                    setJoke(joke);
                                });
                            }}
                        >
                            Discard
                        </Button>
                        <Button
                            className="mt-4 bg-amber-600 hover:bg-amber-700"
                            variant="default"
                            onClick={() => {
                                hold(joke.id);
                                getNextJoke().then((joke) => {
                                    setTweet(joke?.joke || "");
                                    setJoke(joke);
                                });
                            }}
                        >
                            Hold
                        </Button>
                    </div>
                    <Button
                        className="mt-4"
                        onClick={() => {
                            if (tweet.length > 280) {
                                toast.error("Tweet is too long");
                                return;
                            }
                            approve(joke.id, tweet);
                            getNextJoke().then((joke) => {
                                setTweet(joke?.joke || "");
                                setJoke(joke);
                            });
                        }}
                    >
                        Approve
                    </Button>
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold mt-8 mb-4">Live Preview</h2>
                {tweet == debouncedTweet ? (
                    <TweetPreview
                        data={{
                            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII",
                            body: debouncedTweet,
                            username: "jokevault",
                            likes: "100",
                            reposts: "50",
                            views: "1.1k",
                            date: "2022-01-01",
                            time: "12:00 AM",
                            bookmarks: "6",
                            displayName: "Joke Vault",
                            quotes: "0",
                        }}
                    />
                ) : (
                    <Skeleton className="w-[600px] h-64" />
                )}
            </div>
        </div>
    );
}
