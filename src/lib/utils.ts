import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
    y?: number;
    x?: number;
    start?: number;
    duration?: number;
};

export const flyAndScale = (
    node: Element,
    params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    const scaleConversion = (
        valueA: number,
        scaleA: [number, number],
        scaleB: [number, number]
    ) => {
        const [minA, maxA] = scaleA;
        const [minB, maxB] = scaleB;

        const percentage = (valueA - minA) / (maxA - minA);
        const valueB = percentage * (maxB - minB) + minB;

        return valueB;
    };

    const styleToString = (
        style: Record<string, number | string | undefined>
    ): string => {
        return Object.keys(style).reduce((str, key) => {
            if (style[key] === undefined) return str;
            return str + key + ":" + style[key] + ";";
        }, "");
    };

    return {
        duration: params.duration ?? 200,
        delay: 0,
        css: (t) => {
            const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
            const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
            const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

            return styleToString({
                transform:
                    transform +
                    "translate3d(" +
                    x +
                    "px, " +
                    y +
                    "px, 0) scale(" +
                    scale +
                    ")",
                opacity: t,
            });
        },
        easing: cubicOut,
    };
};

export type Person = {
    name: string;
    color: string;
}
export type Row = {
    amount: string;
    actives: Set<string>;
};

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

export type Bill = Record<string, { cost: number, details: string }>;

export const calculateBill = (people: Person[], rows: Row[], total: number): Bill => {
    let bill: Record<string, [number, string[]]> = {};
    people.forEach(person => bill[person.name] = [0, []]);

    rows.forEach(row => {
        const costPerPerson = parseFloat(row.amount) / row.actives.size;
        row.actives.forEach(person => {
            const [cost, details] = bill[person];
            const maybe_divided = row.actives.size > 1 ? `/${row.actives.size}` : "";
            bill[person] = [cost + costPerPerson, [...details, `$${row.amount}${maybe_divided}`]];
        });
    });

    const scaleFactor = total / rows.reduce((acc, row) => acc + parseFloat(row.amount), 0);
    return Object.fromEntries(Object.entries(bill).map(([person, [_cost, _details]]) => {
        const cost = _cost * scaleFactor;
        const details = `(${_details.join(" + ")}) * ${scaleFactor.toFixed(2)}`;
        return [person, { cost, details }];
    }));
}