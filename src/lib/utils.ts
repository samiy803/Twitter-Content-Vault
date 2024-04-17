import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function thousands(number: number) {
    var parts = ((number || number === 0 ? number : "") + "").split(".");

    if (parts.length) {
        parts[0] = parts[0].replace(/(\d)(?=(\d{3})+\b)/g, "$1" + ",");
    }

    return parts.join(".");
}
