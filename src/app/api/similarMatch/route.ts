import { db } from "@/lib/cozo";
import { exec } from "child_process";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {

    const ex = exec("sudo -E python3 src/app/api/similarMatch/embed.py", (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        const res = db.run(`?[dist, k, v] := ~jokes:index_name{ k, v |
            query: q,
            k: 5,
            ef: 20,
            bind_distance: dist,
            bind_vector: bv,
            bind_field: f,
            bind_field_idx: fi,
            radius: 0.1
        }, q = vec(${stdout.trim()})`).then((res) => {
            console.log(res)
        })
    })

    const body = await req.json();

    ex.stdin?.write("search_query: " + body.joke);
    ex.stdin?.end();

    return new Response("OK")
}
