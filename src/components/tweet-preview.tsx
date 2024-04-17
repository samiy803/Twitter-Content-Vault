"use client";
import TweetGenerator from "@/lib/tweet-generator";
import { useEffect, useState } from "react";
import Image from "next/image";
import { type TweetData } from "@/lib/tweet-generator";
import { Skeleton } from "./ui/skeleton";

export default function TweetPreview({ data }: { data: TweetData }) {
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const image = await TweetGenerator(data);
            setImage(image);
        })();
    });

    return (
        <div className="flex flex-col items-center justify-center">
            {!image ? (
                <Skeleton className="w-[600px] h-64" />
            ) : (
                <Image src={image} alt="Tweet Preview" width={600} height={600}/>
            )}
        </div>
    )
}
