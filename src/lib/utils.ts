import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const pastels = [
	'#ffcc99',
	'#ffcccc',
	'#ff99cc',
	'#ffccff',
	'#cc99ff',
	'#ccccff',
	'#99ccff',
	'#ccffff',
	'#99ffcc',
	'#ccffcc',
	'#ccff9',
	'#ffffcc'
];
