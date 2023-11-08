import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type Person = {
    name: string;
    color: string;
}

export function initials({ name }: Person): string {
    return name.split(' ').map((w) => w[0]).join('')
}

export const pastels = [
    "#ffcc99",
    "#ffcccc",
    "#ff99cc",
    "#ffccff",
    "#cc99ff",
    "#ccccff",
    "#99ccff",
    "#ccffff",
    "#99ffcc",
    "#ccffcc",
    "#ccff9",
    "#ffffcc",
]