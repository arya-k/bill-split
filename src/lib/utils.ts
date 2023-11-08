import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

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