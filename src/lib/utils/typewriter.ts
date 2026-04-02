export interface TypewriterConfig {
	lines: string[];
	charDelay: number;
	lineDelay: number;
	bootDelay?: number;
	onStart?: () => void;
	onLineStart?: (line: string, lineIndex: number) => void;
	onChar?: (partialLine: string, charIndex: number, lineIndex: number) => void;
	onLineComplete?: (line: string, lineIndex: number) => void;
	onDone?: () => void;
}

export interface TypewriterController {
	start: () => void;
	cancel: () => void;
}

export function createTypewriter(config: TypewriterConfig): TypewriterController {
	const {
		lines,
		charDelay,
		lineDelay,
		bootDelay = 0,
		onStart,
		onLineStart,
		onChar,
		onLineComplete,
		onDone,
	} = config;

	let charTimer: ReturnType<typeof setTimeout> | null = null;
	let lineTimer: ReturnType<typeof setTimeout> | null = null;
	let cancelled = false;

	function clearTimers(): void {
		if (charTimer !== null) {
			clearTimeout(charTimer);
			charTimer = null;
		}
		if (lineTimer !== null) {
			clearTimeout(lineTimer);
			lineTimer = null;
		}
	}

	function cancel(): void {
		cancelled = true;
		clearTimers();
	}

	function start(): void {
		cancelled = false;
		clearTimers();
		onStart?.();

		let lineIndex = 0;

		function nextLine(): void {
			if (cancelled) return;
			if (lineIndex >= lines.length) {
				onDone?.();
				return;
			}

			const currentLineIndex = lineIndex;
			const fullLine = lines[currentLineIndex];
			lineIndex++;
			onLineStart?.(fullLine, currentLineIndex);

			if (fullLine === '') {
				onLineComplete?.('', currentLineIndex);
				lineTimer = setTimeout(nextLine, lineDelay);
				return;
			}

			let charIndex = 0;
			function nextChar(): void {
				if (cancelled) return;
				if (charIndex >= fullLine.length) {
					onLineComplete?.(fullLine, currentLineIndex);
					lineTimer = setTimeout(nextLine, lineDelay);
					return;
				}

				charIndex++;
				onChar?.(fullLine.slice(0, charIndex), charIndex, currentLineIndex);
				charTimer = setTimeout(nextChar, charDelay);
			}

			nextChar();
		}

		lineTimer = setTimeout(nextLine, bootDelay);
	}

	return {
		start,
		cancel,
	};
}
