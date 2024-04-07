/**
 * @api {get} /api/jokes/count Get Jokes Count
 * @apiName GetJokes
 * @apiGroup Jokes
 * @apiVersion  1.0.0
 * 
 * @param {String} [status] Status of the joke. "approved", "discarded", "used", "none"
 */

import { Joke } from "@/lib/pg";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { status } = req.query;

    
}