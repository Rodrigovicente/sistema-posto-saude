import { Parity } from "./interval";


export type Response<T = undefined> = {
	success: true,
	payload?: T,
	error?: never,
} | {
	success: false,
	error: string,
	payload?: never,
}

export type SearchResult = {
	group: {
		id: number;
		name: string
	};
	interval: {
		startNumber: number;
		endNumber: number;
		parity: Parity
	},
	street: {
		name: string
	}
}
