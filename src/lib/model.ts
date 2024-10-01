import { writable, derived, type Writable } from 'svelte/store';
import { pastels } from './utils';

export type Person = {
	name: string;
	color: string;
};
export type Row = {
	amount: string;
	actives: Set<string>;
};

export type Bill = Record<string, { cost: number; details: string }>;

export class BillManager {
	people: Writable<Person[]> = writable([]);
	rows: Writable<Row[]> = writable([]);
	totalBill: Writable<string> = writable('');
	nextPastelIndex: Writable<number> = writable(0);

	addPerson(name: string) {
		this.people.update((people) => {
			const color = pastels[this.getNextPastelIndex() % pastels.length];
			return [...people, { name, color }];
		});
	}

	removePerson(index: number) {
		this.people.update((people) => people.filter((_, i) => i !== index));
	}

	addRow(amount: string) {
		this.rows.update((rows) => [...rows, { amount, actives: new Set<string>() }]);
	}

	removeRow(index: number) {
		this.rows.update((rows) => rows.filter((_, i) => i !== index));
	}

	togglePersonActive(rowIndex: number, personName: string) {
		this.rows.update((rows) => {
			const row = rows[rowIndex];
			const actives = new Set(row.actives);
			if (actives.has(personName)) {
				actives.delete(personName);
			} else {
				actives.add(personName);
			}
			return rows.map((r, i) => (i === rowIndex ? { ...r, actives } : r));
		});
	}

	setTotalBill(value: string) {
		this.totalBill.set(value);
	}

	private getNextPastelIndex(): number {
		let index: number;
		this.nextPastelIndex.update((i) => {
			index = i;
			return i + 1;
		});
		return index;
	}

	// Derived store for the calculated bill
	bill = derived([this.people, this.rows, this.totalBill], ([$people, $rows, $totalBill]) => {
		const total = parseFloat($totalBill);
		if (isNaN(total) || total <= 0) return null;

		let bill: Record<string, [number, string[]]> = {};
		$people.forEach((person) => (bill[person.name] = [0, []]));

		$rows.forEach((row) => {
			const costPerPerson = parseFloat(row.amount) / row.actives.size;
			row.actives.forEach((person) => {
				const [cost, details] = bill[person];
				const maybe_divided = row.actives.size > 1 ? `/${row.actives.size}` : '';
				bill[person] = [cost + costPerPerson, [...details, `$${row.amount}${maybe_divided}`]];
			});
		});

		const scaleFactor = total / $rows.reduce((acc, row) => acc + parseFloat(row.amount), 0);
		return Object.fromEntries(
			Object.entries(bill).map(([person, [_cost, _details]]) => {
				const cost = _cost * scaleFactor;
				const details = `(${_details.join(' + ')}) * ${scaleFactor.toFixed(2)}`;
				return [person, { cost, details }];
			})
		);
	});

	// Helper method to check if any rows are unassigned
	hasUnassignedRows = derived(this.rows, ($rows) => {
		return $rows.some((row) => row.actives.size === 0);
	});

	// Helper method to check if the total bill is less than the sum of rows
	isTotalLessThanSum = derived([this.rows, this.totalBill], ([$rows, $totalBill]) => {
		const total = parseFloat($totalBill);
		const sum = $rows.reduce((acc, row) => acc + parseFloat(row.amount), 0);
		return total < sum;
	});
}
