"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    LucideIcon,
    Users,
    Home,
    Building2,
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Briefcase,
    Wrench,
} from "lucide-react";
import React from "react";
import Image from "next/image";
import { useSelectedLayoutSegment } from 'next/navigation'
import { Separator } from "./ui/separator";

export interface Items {
    links: {
        title: string;
        icon: string;
        href?: string;
    }[];
    children?: React.ReactNode;
}

interface IconMap {
    [key: string]: LucideIcon;
}

const iconMap: IconMap = {
    home: Home,
    building2: Building2,
    users: Users,
    search: Search,
    plus: Plus,
    chevronLeft: ChevronLeft,
    tools: Wrench,
    briefcase: Briefcase,
};

export function SideBar({ links, children }: Items) {
    const [isCollapsed, setCollapsed] = React.useState(true);
    const segment = useSelectedLayoutSegment();

    return (
        <TooltipProvider>
                <div className="h-screen border-r">
                    <nav
                        className={`grid gap-1 px-2 ${isCollapsed && "justify-center"} transition-[width] transition ease-in-out motion-reduce:transition-none group-[[data-collapsed=true]]:px-2 ${
                            isCollapsed ? "w-15 md:w-16" : "w-56"
                        }`}
                    >
                        <div className="flex flex-row items-center py-2 cursor-pointer" onClick={() => window.location.href = "/"}>
                            <Image
                                src="/logo.png"
                                alt="avatar"
                                width={35}
                                height={35}
                                className={`rounded-full ${!isCollapsed && "ml-2"}`}
                            />
                            <span
                                className={`text-md font-semibold ${
                                    isCollapsed && "hidden"
                                } mx-2`}
                            >
                                Joke Vault
                            </span>
                        </div>
                        <Separator />
                        {isCollapsed ? (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="#"
                                        className={cn(
                                            buttonVariants({
                                                variant: "ghost",
                                                size: "icon",
                                            }),
                                            "h-9 w-9"
                                        )}
                                        onClick={() =>
                                            setCollapsed(!isCollapsed)
                                        }
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    className="flex items-center gap-4"
                                >
                                    Expand
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Link
                                href="#"
                                className={cn(
                                    buttonVariants({
                                        variant: "ghost",
                                        size: "sm",
                                    }),
                                    "justify-center"
                                )}
                                onClick={() => setCollapsed(!isCollapsed)}
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" />
                            </Link>
                        )}
                        {links.map((link, index) =>
                            isCollapsed ? (
                                <Tooltip key={index} delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={link.href ?? "#"}
                                            className={cn(
                                                buttonVariants({
                                                    variant: '/' + (segment ?? "") === link.href ? "default" : "ghost",
                                                    size: "icon",
                                                }),
                                                "h-9 w-9"
                                            )}
                                        >
                                            {React.createElement(
                                                iconMap[link.icon],
                                                {
                                                    className: "h-4 w-4",
                                                }
                                            )}
                                            <span className="sr-only">
                                                {link.title}
                                            </span>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="right"
                                        className="flex items-center gap-4"
                                    >
                                        {link.title}
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Link
                                    key={index}
                                    href={link.href ?? "#"}
                                    className={cn(
                                        buttonVariants({
                                            variant: '/' + (segment ?? "") === link.href ? "default" : "ghost",
                                            size: "sm",
                                        }),
                                        "justify-start"
                                    )}
                                >
                                    {React.createElement(iconMap[link.icon], {
                                        className: "mr-2 h-4 w-4",
                                    })}
                                    {link.title}
                                </Link>
                            )
                        )}
                    </nav>
                </div>
                <div className={`md:m-4 my-8 ${isCollapsed ? "w-[calc(100vw-73px)]" : "w-[calc(100vw-233px)]"}`}>
                    {children}
                </div>
        </TooltipProvider>
    );
}