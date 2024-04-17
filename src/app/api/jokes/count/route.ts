/**
 * @api {get} /api/jokes/count Get Jokes Count
 * @apiName GetJokes
 * @apiGroup Jokes
 * @apiVersion  1.0.0
 * 
 * @param {String} [status] Status of the joke. "approved", "discarded", "used", "none"
 */

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    return new Response("Not implemented", { status: 501 });
}
