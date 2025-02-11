export type Person = {
	name: string;
	color: string;
};

export type Row = {
	amount: number;
	actives: string[];
};

export type Bill = Record<string, { cost: number; details: string }>;

export type Model = {
	people: Person[];
	rows: Row[];
	total: string;
};

export function empty(): Model {
	return {
		people: [],
		rows: [],
		total: ''
	};
}

export function addPerson(model: Model, name: string): Model {
	const color = `hsla(${Math.floor(Math.random() * 360)}, 70%, 72%, 0.8)`;
	return {
		...model,
		people: [...model.people, { name, color }]
	};
}

export function removePerson(model: Model, index: number): Model {
	return {
		...model,
		people: model.people.filter((_, i) => i !== index)
	};
}

function rotateHue(color: string): string {
	const currentHue = parseInt(color.match(/hsla\((\d+)/)?.[1] || '0');
	const dHue = Math.floor(Math.random() * 60) + 40;
	return `hsla(${(currentHue + dHue) % 360}, 70%, 72%, 0.8)`;
}

export function updatePersonColor(model: Model, index: number): Model {
	return {
		...model,
		people: model.people.map((person, i) =>
			i === index ? { ...person, color: rotateHue(person.color) } : person
		)
	};
}

export function addRow(model: Model, amount: number): Model {
	return {
		...model,
		rows: [...model.rows, { amount, actives: [] }]
	};
}

export function removeRow(model: Model, index: number): Model {
	return {
		...model,
		rows: model.rows.filter((_, i) => i !== index)
	};
}

export function togglePersonActive(model: Model, index: number, person: string): Model {
	const newRows = [...model.rows];
	const row = newRows[index];
	const actives = row.actives.includes(person)
		? row.actives.filter((name) => name !== person)
		: [...row.actives, person];
	newRows[index] = { ...row, actives };
	return { ...model, rows: newRows };
}

export function hasUnassignedRows(model: Model): boolean {
	return model.rows.some((row) => row.actives.length === 0);
}

export function isTotalLessThanSum(model: Model): boolean {
	const sum = model.rows.reduce((acc, row) => acc + row.amount, 0);
	return parseFloat(model.total) < sum;
}

export function calculateSubtotal(model: Model): number {
	return model.rows.reduce((acc, row) => acc + row.amount, 0);
}

// Derived store for the calculated bill
export function calculateBill(model: Model): Bill {
	let bill: Record<string, [number, string[]]> = {};
	model.people.forEach((person) => (bill[person.name] = [0, []]));

	model.rows.forEach((row) => {
		const costPerPerson = row.amount / row.actives.length;
		row.actives.forEach((person) => {
			const [cost, details] = bill[person];
			const maybe_divided = row.actives.length > 1 ? `/${row.actives.length}` : '';
			bill[person] = [cost + costPerPerson, [...details, `$${row.amount}${maybe_divided}`]];
		});
	});

	const scaleFactor =
		parseFloat(model.total) / model.rows.reduce((acc, row) => acc + row.amount, 0);
	return Object.fromEntries(
		Object.entries(bill).map(([person, [_cost, _details]]) => {
			const cost = _cost * scaleFactor;
			const details = `(${_details.join(' + ')}) * ${scaleFactor.toFixed(2)}`;
			return [person, { cost, details }];
		})
	);
}
