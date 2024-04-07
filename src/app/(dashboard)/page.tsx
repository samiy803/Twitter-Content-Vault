import {
    Metric,
    MetricContent,
    MetricDescription,
    MetricHeader,
    MetricTitle,
} from "@/components/ui/metric";

import count from "@/actions/count";
import { thousands } from "@/lib/utils";
import fs from "fs";
import TweetGenerator from "@/lib/tweet-generator";
import TweetPreview from "@/components/tweet-preview";

export default async function Home() {
    const availableJokes = thousands(await count("available"));
    const approvedJokes = thousands(await count("approved"));
    const postedJokes = thousands(await count("used"));

    return (
        <div className="mt-4 md:mt-12 mx-2 md:mx-6">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-5xl font-extrabold my-8">
                Joke Vault Dashboard
            </h1>
            <div className="flex flex-row flex-wrap items-start justify-start gap-4 lg:gap-8 mt-4">
                <Metric className="flex-grow">
                    <MetricHeader>
                        <MetricTitle>Available Jokes</MetricTitle>
                        <MetricDescription>
                            Jokes not marked as used or discarded
                        </MetricDescription>
                    </MetricHeader>
                    <MetricContent>
                        <div className="grid w-full items-center gap-4">
                            {availableJokes}
                        </div>
                    </MetricContent>
                </Metric>
                <Metric className="flex-grow">
                    <MetricHeader>
                        <MetricTitle>Approved Jokes</MetricTitle>
                        <MetricDescription>
                            Jokes ready to be posted
                        </MetricDescription>
                    </MetricHeader>
                    <MetricContent>
                        <div className="grid w-full items-center gap-4">
                            {approvedJokes}
                        </div>
                    </MetricContent>
                </Metric>
                <Metric className="flex-grow">
                    <MetricHeader>
                        <MetricTitle>Posted Jokes</MetricTitle>
                        <MetricDescription>
                            Jokes that have been posted/used
                        </MetricDescription>
                    </MetricHeader>
                    <MetricContent>
                        <div className="grid w-full items-center gap-4">
                            {postedJokes}
                        </div>
                    </MetricContent>
                </Metric>
            </div>
            <TweetPreview
                data={{
                    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII",
                    body: "This is a test joke",
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
        </div>
    );
}
