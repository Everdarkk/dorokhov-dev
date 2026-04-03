// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import 'svelte/elements';

declare module 'svelte/elements' {
	interface HTMLAttributes<T extends EventTarget> {
		'on:reveal'?: (event: CustomEvent<void>) => void;
	}
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

}

export {};
