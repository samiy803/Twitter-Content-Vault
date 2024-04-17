/**
 * @api {get} /api/jokes Get Jokes
 * @apiName GetJokes
 * @apiGroup Jokes
 * @apiVersion  1.0.0
 * 
 * @param {String} [search] Search query
 * @param {Number} [limit] Limit the number of jokes
 * @param {Number} [offset] Offset the jokes
 */

import { Joke } from "@/lib/pg";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    // const { search, limit, offset } = req.query;

    return new Response("Not implemented", { status: 501 });
}