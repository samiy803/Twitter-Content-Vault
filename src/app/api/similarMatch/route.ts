import { db } from "@/lib/cozo";
import { exec } from "child_process";
import { NextRequest } from "next/server";
import { Joke } from "@/lib/pg";

export async function POST(req: NextRequest) {
    return new Promise<Response>(async (resolve, reject) => {
        const ex = exec(
            "sudo -E python3 src/app/api/similarMatch/embed.py",
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    reject(new Response("Error", { status: 500 }));
                    return;
                }
                let i = 0;
                const query = () => {
                    const res = db
                        .run(
                            `?[dist, k] := ~jokes:index_name{ k |
                        query: q,
                        k: 5,
                        ef: 20,
                        bind_distance: dist,
                    }, q = vec(${stdout.trim()})`
                        )
                        .catch(async (err) => {
                            // database is probably locked. retry after 500ms second
                            await new Promise((resolve) =>
                                setTimeout(resolve, 500)
                            );
                            query();
                            // don't want to exceed recursion limit, so we'll just retry 15 times
                            if (i++ > 15) {
                                console.error(
                                    "Failed to update database after 15 retries."
                                );
                                console.error(err);
                            }
                        })
                        .then((res) => {
                            Joke.findAll({
                                where: {
                                    id: res.rows.map((row: any) => row[1]),
                                },
                            }).then((jokes) => {
                                const similarJokes = jokes // basically a join
                                    .map((joke: any) => {
                                        let j = joke.toJSON();
                                        j.similarity =
                                            res.rows.find(
                                                (row: any) => row[1] == j.id // string and number comparison, ew :(
                                            )[0] * 100;
                                        j.similarity = (100 - j.similarity).toFixed(2);
                                        return j;
                                    })
                                    .sort((a: any, b: any) => {
                                        return b.similarity - a.similarity;
                                    });
                                resolve(
                                    new Response(JSON.stringify(similarJokes))
                                );
                            });
                        });
                };
                query();
            }
        );

        const body = await req.json();

        ex.stdin?.write("search_query: " + body.joke);
        ex.stdin?.end();
    });
}
