import { type Model, empty } from './model';

import { writable, type Writable } from 'svelte/store';

export const model: Writable<Model> = writable(empty());
