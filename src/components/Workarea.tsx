"use client";
import TweetPreview from "@/components/tweet-preview";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { approve, discard, getNextJoke, hold } from "@/actions/jokes";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";

export default function Workarea() {
    const [joke, setJoke] = useState({} as any);
    const [tweet, setTweet] = useState("");
    const [debouncedTweet] = useDebounce(tweet, 250);
    const [similarJokes, setSimilarJokes] = useState<any[] | null>(null);
    const [time, setTime] = useState("");

    function similarMatch(joke: string) {
        const currentTime = +new Date();
        fetch("/api/similarMatch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ joke }),
        }).then((res) => {
            res.json().then((data) => {
                setSimilarJokes(data);
                setTime((+new Date() - currentTime) / 1000 + "s");
            });
        });
    }

    useEffect(() => {
        getNextJoke().then((joke) => {
            setTweet(joke?.joke || "");
            setJoke(joke);
            similarMatch(joke.joke);
        });
    }, []);

    return (
        <div className="flex flex-row flex-wrap items-start justify-between">
            <div className="flex-grow">
                <div className="ps-0 pe-6">
                    <h2 className="text-xl font-bold mb-4">Edit Tweet</h2>
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
                                    similarMatch(joke.joke);
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
                                    similarMatch(joke.joke);
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
                                similarMatch(joke.joke);
                            });
                        }}
                    >
                        Approve
                    </Button>
                </div>
            </div>
            <div className="pe-6">
                <h2 className="text-xl font-bold mb-4">Live Preview</h2>
                {tweet == debouncedTweet ? (
                    <TweetPreview
                        data={{
                            image: "/logo.png",
                            body: debouncedTweet,
                            username: "jokevaults",
                            likes: "324",
                            reposts: "36",
                            views: "1.1k",
                            date: new Date().toISOString().split("T")[0],
                            time: new Date().toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                            }),
                            bookmarks: "16",
                            displayName: "Joke Vault",
                            quotes: "10",
                        }}
                    />
                ) : (
                    <Skeleton className="w-[600px] h-64" />
                )}
            </div>
            <div className="flex flex-col w-[clamp(290px,30vw,450px)]">
                <h2 className="text-xl font-bold mb-4">Similar Jokes</h2>
                <div className="flex flex-col space-y-4">
                    <Table>
                        <TableCaption>{similarJokes ? "Similar Jokes. Executed in " + time : "Doing a vector search for similar jokes... This may take a while."} </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Joke</TableHead>
                                <TableHead className="w-[40px]">
                                    Similarity
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* simple joke and similarit */}
                            {similarJokes
                                ? similarJokes.map((joke) => (
                                      <TableRow key={joke.id}>
                                          <TableCell>{joke.joke}</TableCell>
                                          <TableCell>
                                              {joke.distance}%
                                          </TableCell>
                                      </TableRow>
                                  ))
                                : [...Array(5)].map((_, i) => (
                                      <TableRow key={i}>
                                          <TableCell>
                                              <Skeleton className="w-full h-6"/>
                                          </TableCell>
                                          <TableCell>
                                              <Skeleton className="w-full h-6"/>
                                          </TableCell>
                                      </TableRow>
                                  ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
