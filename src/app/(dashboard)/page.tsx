import {
    Metric,
    MetricContent,
    MetricDescription,
    MetricHeader,
    MetricTitle,
} from "@/components/ui/metric";

import count from "@/actions/count";
import { thousands } from "@/lib/utils";
import Workarea from "@/components/Workarea";
import Jokes from "@/components/Jokes";
import { Joke } from "@/lib/pg";

export const dynamic = "force-dynamic";

export default async function Home() {
    const availableJokes = thousands(await count("available"));
    const approvedJokes = thousands(await count("approved"));
    const postedJokes = thousands(await count("used"));

    const jokes = (await Joke.findAll({
        order: [["approved", "DESC"]],
        limit: 100,
    })).map((joke) => joke.toJSON()) as any[];

    console.log(jokes);

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
            <h2 className="text-2xl font-bold mt-8 mb-4">Compose</h2>
            <Workarea />
            <h2 className="text-2xl font-bold mt-8 mb-4">Past Jokes</h2>
            <Jokes jokes={jokes}/>
        </div>
    );
}
