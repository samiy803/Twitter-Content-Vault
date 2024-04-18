"use client";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function Jokes({ jokes }: { jokes: any[] }) {
    const [jokeList, setJokesList] = useState<any[]>(jokes);

    useEffect(() => {
        setJokesList(jokes);
    }, [jokes]);

    return (
        <div className="flex flex-row justify-center w-full">
            <div style={{ width: "clamp(320px, 70%, 1024px)" }}>
                <div className="mt-4 md:mt-12 mx-2 md:mx-6">
                    <div className="flex flex-row w-full justify-between my-2 items-center">
                        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold my-8">
                            Past Jokes
                        </h1>
                    </div>
                    <Table>
                        <TableCaption>A list of jokes.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Joke</TableHead>
                                <TableHead className="w-[70px]">
                                    Status
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jokeList.map((joke: any) => {
                                let status = <></>;
                                if (joke.approved && !joke.used) {
                                    status = (
                                        <span className="text-green-600">
                                            Approved
                                        </span>
                                    );
                                }
                                else if (joke.used) {
                                    status = (
                                        <span className="text-blue-600">
                                            Used
                                        </span>
                                    );
                                }
                                else if (joke.hold) {
                                    status = (
                                        <span className="text-yellow-600">
                                            Hold
                                        </span>
                                    );
                                }
                                else if (joke.rejected) {
                                    status = (
                                        <span className="text-red-600">
                                            Rejected
                                        </span>
                                    );
                                }
                                else {
                                    status = (
                                        <span className="text-gray-600">
                                            Pending
                                        </span>
                                    );
                                }
                                return (
                                <TableRow key={joke.id}>
                                    <TableCell>{joke.joke}</TableCell>
                                    <TableCell>
                                        {status}
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell>Joke</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </div>
    );
}
